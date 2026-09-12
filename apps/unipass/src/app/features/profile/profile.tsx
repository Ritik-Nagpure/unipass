import { useState } from 'react'
import { LuCamera, LuMail, LuPhone, LuMapPin, LuCalendar, LuPencil } from 'react-icons/lu'
import PageHeader from '../../shared/components/page-header'
import Card from '../../shared/components/card'
import { useAppSelector } from '../../shared/hooks/store/store'

const ProfilePage = () => {
    const user = { name: 'John', email: 'john.doe@abc.xy' } // useAppSelector((s) => s.auth.user)
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                <PageHeader
                    title="Profile"
                    subtitle="Manage your personal information and account details."
                    action={
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <LuPencil size={14} />
                            {isEditing ? 'Save changes' : 'Edit profile'}
                        </button>
                    }
                />

                {/* Avatar + header card */}
                <Card className="mb-6" padding="lg">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#7C5CFC] flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold">
                                {user?.name?.charAt(0) ?? 'S'}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2D2D3A] border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                                <LuCamera size={14} />
                            </button>
                        </div>

                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <h2 className="text-white text-lg sm:text-xl font-semibold">
                                {user?.name ?? 'Sandra Marx'}
                            </h2>
                            <p className="text-gray-400 text-sm">{user?.email ?? 'sandra@gmail.com'}</p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
                                    Verified
                                </span>
                                <span className="px-2.5 py-1 rounded-full bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 text-xs">
                                    Pro Plan
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal info */}
                    <Card>
                        <h3 className="text-white font-medium mb-4">Personal Information</h3>
                        <div className="space-y-4">
                            <Field label="Full name" value={user?.name ?? 'Sandra Marx'} icon={LuPencil} />
                            <Field label="Email address" value={user?.email ?? 'sandra@gmail.com'} icon={LuMail} />
                            <Field label="Phone number" value="+1 (234) 567-890" icon={LuPhone} />
                            <Field label="Location" value="San Francisco, CA" icon={LuMapPin} />
                        </div>
                    </Card>

                    {/* Account meta */}
                    <Card>
                        <h3 className="text-white font-medium mb-4">Account</h3>
                        <div className="space-y-4">
                            <Field label="Member since" value="January 2024" icon={LuCalendar} />
                            <Field label="Account ID" value="UP-492-881" icon={LuPencil} />
                            <Field label="Last login" value="2 hours ago" icon={LuCalendar} />
                            <Field label="Two-factor" value="Not enabled" icon={LuMail} />
                        </div>
                    </Card>
                </div>

                {/* Danger zone */}
                <Card className="mt-6 border-red-500/30">
                    <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors">
                        Delete account
                    </button>
                </Card>

            </div>
        </div>
    )
}

/* ---------- helper ---------- */

interface FieldProps {
    label: string
    value: string
    icon: React.ComponentType<{ size?: number }>
}

function Field({ label, value, icon: Icon }: FieldProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[#2D2D3A] flex items-center justify-center shrink-0">
                <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm text-white truncate">{value}</p>
            </div>
        </div>
    )
}

export default ProfilePage