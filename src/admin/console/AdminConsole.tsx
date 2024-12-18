import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight,
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

const IconComponent = ({ name }: { name: string }) => {
  const Icon = icons[name] || Settings;
  return <Icon className="h-5 w-5 shrink-0 text-gray-400" />;
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
        "flex flex-col transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-72" : "w-16"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center justify-between">
            {sidebarOpen && (
              <div className="h-8 w-auto flex items-center justify-center">
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
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <nav className={cn(
            "flex flex-1 flex-col",
            !sidebarOpen && "items-center"
          )}>
            <ul role="list" className="flex flex-1 flex-col gap-y-7 w-full">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((section) => (
                    <li key={section.name} className="space-y-1">
                      <div className="px-2 py-2">
                        <div className={cn(
                          "flex items-center gap-x-3",
                          !sidebarOpen && "justify-center"
                        )}>
                          <section.icon className="h-5 w-5 shrink-0 text-gray-400" />
                          {sidebarOpen && (
                            <span className="text-sm font-semibold text-gray-900">
                              {t(`console.${section.name}.title`)}
                            </span>
                          )}
                        </div>
                      </div>
                      {section.children && (
                        <ul className="space-y-1">
                          {section.children.map((item) => (
                            <li key={item.name}>
                              {!item.children ? (
                                <button
                                  onClick={() => navigate(item.href)}
                                  className={cn(
                                    "flex w-full items-center gap-x-3 rounded-md py-2 text-sm text-gray-700 hover:bg-gray-50",
                                    sidebarOpen ? "pl-9 pr-2" : "justify-center px-2"
                                  )}
                                  title={!sidebarOpen ? t(`console.${section.name}.${item.name}.title`) : undefined}
                                >
                                  <IconComponent name={item.name} />
                                  {sidebarOpen && t(`console.${section.name}.${item.name}.title`)}
                                </button>
                              ) : (
                                <div>
                                  <button
                                    onClick={() => toggleExpand(item.name)}
                                    className={cn(
                                      "flex w-full items-center gap-x-3 rounded-md py-2 text-sm text-gray-700",
                                      sidebarOpen ? "pl-9 pr-2" : "justify-center px-2",
                                      expandedItems.includes(item.name) ? "bg-gray-50" : "hover:bg-gray-50"
                                    )}
                                    title={!sidebarOpen ? t(`console.${section.name}.${item.name}.title`) : undefined}
                                  >
                                    <IconComponent name={item.name} />
                                    {sidebarOpen && (
                                      <>
                                        {t(`console.${section.name}.${item.name}.title`)}
                                        <ChevronRight
                                          className={cn(
                                            "ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform",
                                            expandedItems.includes(item.name) && "rotate-90"
                                          )}
                                        />
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
                                              "flex w-full items-center gap-x-3 rounded-md py-2 text-sm text-gray-700 hover:bg-gray-50",
                                              sidebarOpen ? "pl-16 pr-2" : "justify-center px-2"
                                            )}
                                            title={!sidebarOpen ? t(`console.${section.name}.${item.name}.${subItem.name}.title`) : undefined}
                                          >
                                            <IconComponent name={subItem.name} />
                                            {sidebarOpen && t(`console.${section.name}.${item.name}.${subItem.name}.title`)}
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
                      )}
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={handleSignOut}
                  className={cn(
                    "flex w-full items-center gap-x-3 rounded-md py-2 text-sm text-gray-700 hover:bg-gray-50",
                    sidebarOpen ? "px-2" : "justify-center px-2"
                  )}
                >
                  <LogOut className="h-5 w-5 shrink-0 text-gray-400" />
                  {sidebarOpen && <span>{t('console.signOut')}</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <div className="flex-1 overflow-auto p-8">
          {/* Content area */}
        </div>
      </div>
    </div>
  );
}
