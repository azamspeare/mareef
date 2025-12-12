import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WaitlistDialogProps {
    children: React.ReactNode
    title?: string
    description?: string
}

export function WaitlistDialog({
    children,
    title = 'Join the Waitlist',
    description = "Enter your email and we'll notify you when this feature launches.",
}: WaitlistDialogProps) {
    const [open, setOpen] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/waitlist', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('You have been added to the waitlist!', {
                    description: "We'll notify you when this feature launches.",
                    position: 'bottom-right',
                })
                setOpen(false)
                reset()
            },
            onError: (errors) => {
                if (errors.email) {
                    if (errors.email.includes('already')) {
                        toast.info('You are already on the waitlist!', {
                            description: "We'll notify you when this feature launches.",
                            position: 'bottom-right',
                        })
                        setOpen(false)
                        reset()
                    } else {
                        toast.error('Failed to join waitlist', {
                            description: errors.email,
                            position: 'bottom-right',
                        })
                    }
                }
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 pb-4">
                        <div className="grid gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Joining...' : 'Join Waitlist'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
