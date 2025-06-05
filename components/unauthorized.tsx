import { EyeClosedIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center flex-1">
            <div className="max-w h-[100vh] flex items-center">
                <div className="flex flex-col items-center">
                    <EyeClosedIcon className="w-12 h-12 text-[#0a3141]" />
                    <h1 className="text-2xl font-semibold text-[#0a3141] mt-4">Unauthorized</h1>
                    <p className="text-gray-500 mt-2">You do not have permission to access this page.</p>
                    <Link href={'/auth'}>
                        <Button className="w-full h-12 bg-[#0a3141] hover:bg-[#0a3141]/90 text-white mt-2">
                            Go Back!
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
