import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, LayoutDashboard, ClipboardCheck, FileText, AlertTriangle, RefreshCw, Truck, GraduationCap, Activity, Building2, Building, Beaker, HardDrive } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  color?: string;
}

const AppSidebar = () => {
  const { t } = useTranslation();
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const sidebarLinks: SidebarLink[] = [
    {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-500'
  }, {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    color: 'text-green-500'
  }, {
    name: 'Standards',
    href: '/standards',
    icon: ClipboardCheck,
    color: 'text-purple-500'
  }, {
    name: 'Organizations',
    href: '/organizations',
    icon: Building,
    color: 'text-indigo-600'
  }, {
    name: 'Facilities',
    href: '/facilities',
    icon: Building2,
    color: 'text-teal-500'
  }, {
    name: 'Audits',
    href: '/audits',
    icon: HardDrive,
    color: 'text-yellow-600'
  }, {
    name: 'Non-Conformance',
    href: '/non-conformance',
    icon: AlertTriangle,
    color: 'text-red-500'
  }, {
    name: 'CAPA',
    href: '/capa',
    icon: RefreshCw,
    color: 'text-orange-500'
  }, {
    name: 'Suppliers',
    href: '/suppliers',
    icon: Truck,
    color: 'text-pink-500'
  }, {
    name: 'Training',
    href: '/training',
    icon: GraduationCap,
    color: 'text-indigo-500'
  }, {
    name: 'HACCP',
    href: '/haccp',
    icon: Beaker,
    color: 'text-teal-500'
  }, {
    name: 'Traceability',
    href: '/traceability',
    icon: Activity,
    color: 'text-cyan-500'
  }
  ];
  
  const isActiveLink = (href: string) => {
    return location.pathname === href || (href !== '/' && href !== '/dashboard' && location.pathname.startsWith(href));
  };
  
  return (
    <Sidebar className="border-r border-border h-screen flex flex-col transition-all duration-300">
      <div className="border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-primary">Compliance Core</span>
          </Link>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {sidebarLinks.map(link => (
            <Link 
              key={link.href} 
              to={link.href}
              className={`
                group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors
                ${isActiveLink(link.href) ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary hover:text-foreground'}
              `}
            >
              <link.icon className={`${isActiveLink(link.href) ? link.color : 'text-muted-foreground'} mr-3 h-5 w-5 flex-shrink-0`} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-2">
              <div className="flex items-center">
                <Avatar className="h-7 w-7 mr-2">
                  <AvatarImage src={user?.avatar_url || ''} />
                  <AvatarFallback>{user?.full_name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium truncate">
                  {user?.full_name || user?.email || t('common.user')}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('profile.title')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              {t('profile.viewProfile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              {t('profile.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <LanguageSelector />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
