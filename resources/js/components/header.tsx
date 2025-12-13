import { Link } from '@inertiajs/react'
import { Menu, X, Headphones, BookOpen, PenLine, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import React from 'react'
import { cn, getTeacherUrl } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MareefLogo } from '@/components/logo'

const getMenuItems = (faqHref: string) => [
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: faqHref },
]

const taskTypes = [
    { name: 'Writing', href: '/tasks/writing', icon: PenLine, description: 'Essay and text assignments' },
    { name: 'Reading', href: '/tasks/reading', icon: BookOpen, description: 'Comprehension tasks' },
    { name: 'Listening', href: '/tasks/listening', icon: Headphones, description: 'Audio-based exercises' },
    { name: 'Speaking', href: '/tasks/speaking', icon: Mic, description: 'Voice recording tasks' },
]

interface HeroHeaderProps {
    faqHref?: string
}

export const HeroHeader = ({ faqHref = '#faq' }: HeroHeaderProps) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const teacherLoginUrl = getTeacherUrl('login')
    const menuItems = getMenuItems(faqHref)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home">
                                <MareefLogo />
                            </Link>

                            <div className="flex items-center gap-2 lg:hidden">
                                <ThemeToggle />
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-6">
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="!bg-transparent text-muted-foreground hover:text-accent-foreground hover:!bg-transparent focus:!bg-transparent data-[state=open]:!bg-transparent data-[active]:!bg-transparent h-auto p-0 text-sm font-normal">
                                            Features
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[180px] gap-4">
                                                <li>
                                                    {taskTypes.map((task) => (
                                                        <NavigationMenuLink key={task.name} asChild>
                                                            <Link
                                                                href={task.href}
                                                                className="flex-row items-center gap-2">
                                                                <task.icon />
                                                                {task.name}
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    ))}
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    {menuItems.map((item, index) => (
                                        <NavigationMenuItem key={index}>
                                            {item.href.startsWith('#') ? (
                                                <a
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground text-sm duration-150">
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground text-sm duration-150">
                                                    {item.name}
                                                </Link>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    <li>
                                        <span className="text-foreground font-medium block mb-3">Features</span>
                                        <ul className="space-y-3 pl-4">
                                            {taskTypes.map((task) => (
                                                <li key={task.name}>
                                                    <Link
                                                        href={task.href}
                                                        onClick={() => setMenuState(false)}
                                                        className="text-muted-foreground hover:text-accent-foreground flex items-center gap-2 duration-150">
                                                        <task.icon className="h-4 w-4" />
                                                        <span>{task.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            {item.href.startsWith('#') ? (
                                                <a
                                                    href={item.href}
                                                    onClick={() => setMenuState(false)}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMenuState(false)}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <div className="hidden lg:block">
                                    <ThemeToggle />
                                </div>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <a href={teacherLoginUrl}>
                                        <span>Get Started</span>
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <a href={teacherLoginUrl}>
                                        <span>Get Started</span>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
