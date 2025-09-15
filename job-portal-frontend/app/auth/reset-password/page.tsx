
import ResetPasswordModal from "@/components/ResetPasswordModal";
import { Suspense } from "react"
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordModal />
        </Suspense>
    );
}
