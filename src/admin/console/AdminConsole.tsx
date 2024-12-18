import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useMarketplace } from '@/lib/hooks';
import { DEFAULT_MARKETPLACE } from '@/lib/constants';
import {
  Menu,
  Users,
  ListFilter,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  ClipboardList,
  Star,
  DollarSign,
  Mail,
  Globe,
  Lock,
  Layout,
  Palette,
  UserCircle,
  Tag,
  Search,
  Percent,
  LucideIcon,
  LayoutDashboard,
  Wrench
} from 'lucide-react';
import { TopNav } from './TopNav';

interface NavItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  children?: {
    name: string;
    href: string;
    children?: {
      name: string;
      href: string;
    }[];
  }[];
}

const icons: Record<string, LucideIcon> = {
  users: Users,
  listings: ListFilter,
  transactions: DollarSign,
  reviews: Star,
  general: Settings,
  content: FileText,
  design: Palette,
  emailConfiguration: Mail,
  localization: Globe,
  accessControl: Lock,
  navBar: Layout,
  footer: Layout,
  pages: FileText,
  texts: FileText,
  messagingTemplates: Mail,
  branding: Palette,
  layout: Layout,
  userTypes: UserCircle,
  userFields: UserCircle,
  listingTypes: Tag,
  listingCategories: Tag,
  listingFields: ClipboardList,
  listingSearch: Search,
  commissions: Percent,
  minimumSize: DollarSign
};

const navigation: NavItem[] = [
  {
    name: 'manage',
    icon: LayoutDashboard,
    children: [
      { name: 'users', href: '/admin/manage/users' },
      { name: 'listings', href: '/admin/manage/listings' },
      { name: 'transactions', href: '/admin/manage/transactions' },
      { name: 'reviews', href: '/admin/manage/reviews' }
    ]
  },
  {
    name: 'configuration',
    icon: Wrench,
    children: [
      {
        name: 'general',
        href: '/admin/config/general',
        children: [
          { name: 'emailConfiguration', href: '/admin/config/general/email' },
          { name: 'localization', href: '/admin/config/general/localization' },
          { name: 'accessControl', href: '/admin/config/general/access' }
        ]
      },
      {
        name: 'content',
        href: '/admin/config/content',
        children: [
          { name: 'navBar', href: '/admin/config/content/navbar' },
          { name: 'footer', href: '/admin/config/content/footer' },
          { name: 'pages', href: '/admin/config/content/pages' },
          { name: 'texts', href: '/admin/config/content/texts' },
          { name: 'messagingTemplates', href: '/admin/config/content/messaging' }
        ]
      },
      {
        name: 'design',
        href: '/admin/config/design',
        children: [
          { name: 'branding', href: '/admin/config/design/branding' },
          { name: 'layout', href: '/admin/config/design/layout' }
        ]
      },
      {
        name: 'users',
        href: '/admin/config/users',
        children: [
          { name: 'userTypes', href: '/admin/config/users/types' },
          { name: 'userFields', href: '/admin/config/users/fields' }
        ]
      },
      {
        name: 'listings',
        href: '/admin/config/listings',
        children: [
          { name: 'listingTypes', href: '/admin/config/listings/types' },
          { name: 'listingCategories', href: '/admin/config/listings/categories' },
          { name: 'listingFields', href: '/admin/config/listings/fields' },
          { name: 'listingSearch', href: '/admin/config/listings/search' }
        ]
      },
      {
        name: 'transactions',
        href: '/admin/config/transactions',
        children: [
          { name: 'commissions', href: '/admin/config/transactions/commissions' },
          { name: 'minimumSize', href: '/admin/config/transactions/minimum-size' }
        ]
      }
    ]
  }
];

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const Icon = icons[name] || Settings;
  return <Icon className={className || "h-5 w-5 shrink-0 text-gray-400"} />;
};

export default function AdminConsole() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const { marketplace } = useMarketplace();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/admin/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen">
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col",
        sidebarOpen ? "lg:w-72" : "lg:w-20"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-light bg-primary-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-between">
            {sidebarOpen && (
              <div className="h-8 w-auto flex items-center">
                <img
                  className="h-8 w-auto object-contain"
                  src={marketplace?.logo || DEFAULT_MARKETPLACE.logo}
                  alt={marketplace?.name || DEFAULT_MARKETPLACE.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_MARKETPLACE.logo;
                  }}
                />
              </div>
            )}
            <button
              type="button"
              className={cn(
                "rounded-lg p-1.5",
                "text-primary-dark hover:bg-primary-light focus:outline-none",
                !sidebarOpen && "w-full flex justify-center"
              )}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {navigation.map((section) => (
                <li key={section.name}>
                  {sidebarOpen && (
                    <div className="text-xs font-semibold leading-6 text-secondary-gray">
                      {t(`console.${section.name}.title`)}
                    </div>
                  )}
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {section.children?.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <button
                            onClick={() => navigate(item.href)}
                            className={cn(
                              "flex w-full items-center gap-x-3 rounded-md py-2 text-sm font-medium",
                              "text-primary-dark hover:bg-primary-light hover:text-primary-dark",
                              sidebarOpen ? "pl-3 pr-2" : "justify-center px-2"
                            )}
                            title={!sidebarOpen ? t(`console.${section.name}.${item.name}.title`) : undefined}
                          >
                            <IconComponent 
                              name={item.name} 
                              className="h-5 w-5 text-primary-dark"
                            />
                            {sidebarOpen && t(`console.${section.name}.${item.name}.title`)}
                          </button>
                        ) : (
                          <div>
                            <button
                              onClick={() => toggleExpand(item.name)}
                              className={cn(
                                "flex w-full items-center gap-x-3 rounded-md py-2 text-sm font-medium",
                                "text-primary-dark hover:bg-primary-light",
                                expandedItems.includes(item.name) ? "bg-primary-light" : "",
                                sidebarOpen ? "pl-3 pr-2" : "justify-center px-2"
                              )}
                              title={!sidebarOpen ? t(`console.${section.name}.${item.name}.title`) : undefined}
                            >
                              <IconComponent 
                                name={item.name}
                                className="h-5 w-5 text-primary-dark"
                              />
                              {sidebarOpen && (
                                <>
                                  {t(`console.${section.name}.${item.name}.title`)}
                                  {expandedItems.includes(item.name) ? (
                                    <ChevronUp className="ml-auto h-4 w-4 text-primary-dark" />
                                  ) : (
                                    <ChevronDown className="ml-auto h-4 w-4 text-primary-dark" />
                                  )}
                                </>
                              )}
                            </button>
                            {expandedItems.includes(item.name) && item.children && (
                              <ul className="mt-1 space-y-1">
                                {item.children.map((subItem) => (
                                  <li key={subItem.name}>
                                    <button
                                      onClick={() => navigate(subItem.href)}
                                      className={cn(
                                        "flex w-full items-center gap-x-3 rounded-md py-2 text-sm font-medium",
                                        "text-primary-dark hover:bg-primary-light hover:text-primary-dark",
                                        sidebarOpen ? "pl-6 pr-2" : "justify-center px-2"
                                      )}
                                      title={!sidebarOpen ? t(`console.${section.name}.${item.name}.${subItem.name}.title`) : undefined}
                                    >
                                      <IconComponent 
                                        name={subItem.name}
                                        className="h-5 w-5 text-primary-light"
                                      />
                                      {sidebarOpen && (
                                        <span className="flex-1 text-left">
                                          {t(`console.${section.name}.${item.name}.${subItem.name}.title`)}
                                        </span>
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pb-4">
            <button
              onClick={handleSignOut}
              className={cn(
                "flex w-full items-center gap-x-3 rounded-md p-2",
                "text-sm font-medium text-primary-dark",
                "hover:bg-primary-light hover:text-primary-dark"
              )}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && t('console.signOut')}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <div className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
