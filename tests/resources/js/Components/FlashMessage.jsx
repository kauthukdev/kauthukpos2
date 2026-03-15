import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function FlashMessage() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: flash.success,
                confirmButtonText: 'OK',
            });
        } else if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: flash.error,
                confirmButtonText: 'OK',
            });
        } else if (flash.message) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: flash.message,
                confirmButtonText: 'OK',
            });
        }
    }, [flash]);

    // This component doesn't render anything visible
    return null;
} 