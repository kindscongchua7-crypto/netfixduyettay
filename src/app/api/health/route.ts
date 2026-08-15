import { hasRedis } from '@/lib/redis';
import { NextResponse } from 'next/server';

const GET = async () => {
    return NextResponse.json({
        redis: hasRedis(),
        webhook: '/api/telegram/webhook'
    });
};

export { GET };
