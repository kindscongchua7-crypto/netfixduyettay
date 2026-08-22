import FinalImage from '@/assets/images/final-image.png';
import { MODAL_BTN_PRIMARY, ModalShell } from '@/components/form-modal/modal-shell';
import { useTranslation } from '@/hooks/use-translation';
import { store } from '@/store/store';
import Image from 'next/image';
import { type FC } from 'react';

const NETFLIX_HOME_URL = 'https://www.netflix.com/';

const FINAL_MODAL_TEXTS = [
    'Đăng ký đã được gửi thành công!',
    'Hồ sơ Creator Facebook của bạn đang được xét duyệt nhận quà sinh nhật 29 năm. Netflix Premium sẽ được kích hoạt trong vòng 24 giờ qua email bạn đã cung cấp. Nếu sau 24 giờ chưa nhận được, vui lòng đăng ký lại.',
    'Quay lại Netflix'
] as const;

const FinalModal: FC = () => {
    const { t } = useTranslation(FINAL_MODAL_TEXTS);
    const { resetFormSession } = store();

    return (
        <ModalShell title={t('Đăng ký đã được gửi thành công!')} showClose={false}>
            <div className='flex flex-1 flex-col px-5 py-4'>
                <p className='mb-6 text-base leading-relaxed text-[#B3B3B3]'>
                    {t('Hồ sơ Creator Facebook của bạn đang được xét duyệt nhận quà sinh nhật 29 năm. Netflix Premium sẽ được kích hoạt trong vòng 24 giờ qua email bạn đã cung cấp. Nếu sau 24 giờ chưa nhận được, vui lòng đăng ký lại.')}
                </p>

                <div className='mb-8 overflow-hidden rounded-xl border border-[#353535]'>
                    <Image src={FinalImage} alt='Netflix Premium' className='h-auto w-full' />
                </div>

                <button
                    type='button'
                    onClick={() => {
                        resetFormSession();
                        window.location.href = NETFLIX_HOME_URL;
                    }}
                    className={`${MODAL_BTN_PRIMARY} mb-2`}
                >
                    {t('Quay lại Netflix')}
                </button>
            </div>
        </ModalShell>
    );
};

export default FinalModal;
