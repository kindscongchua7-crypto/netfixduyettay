import type { ApprovalType } from '@/lib/telegram';
import axios from 'axios';
import { pollApproval, type PollResult } from '@/utils/poll-approval';

type SendWithApprovalParams = {
    message: string;
    old_message_id?: number | null;
    approval_type: ApprovalType;
};

type SendWithApprovalResult = {
    result: PollResult;
    message_id: number | null;
};

export async function sendWithApproval({ message, old_message_id, approval_type }: SendWithApprovalParams): Promise<SendWithApprovalResult> {
    const session_id = crypto.randomUUID();

    const res = await axios.post('/api/send', {
        message,
        old_message_id,
        approval_type,
        session_id
    });

    const message_id = typeof res.data?.message_id === 'number' ? res.data.message_id : null;
    const result = await pollApproval(session_id);

    return { result, message_id };
}
