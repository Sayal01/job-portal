"use client";
import ManageUsersPage from "./ManageUsersPage";
import { Suspense } from "react";

export default function UsersPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ManageUsersPage />
        </Suspense>
    );
}
