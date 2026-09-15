import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface RouterContextType {
  pathname: string;
  searchParams: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
}

const getInitialSearchParams = (): URLSearchParams => {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

const RouterContext = createContext<RouterContextType>({
  pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
  searchParams: getInitialSearchParams(),
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname || '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(getInitialSearchParams);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
    if (typeof window === 'undefined') return;

    const targetUrl = to.startsWith('/') ? to : `/${to}`;
    
    // Check if target is same as current to avoid redundant state pushes
    if (window.location.pathname !== targetUrl) {
      if (options?.replace) {
        window.history.replaceState({}, '', targetUrl);
      } else {
        window.history.pushState({}, '', targetUrl);
      }
      setPathname(targetUrl.split('?')[0]);
      setSearchParams(new URLSearchParams(window.location.search));
    }

    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, searchParams, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
  scrollToTop?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  href,
  className,
  children,
  scrollToTop = true,
  onClick,
  ...props
}) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Allow default behavior for modified clicks (cmd+click, ctrl+click, new tab) or external links
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('#')
    ) {
      return;
    }

    e.preventDefault();
    navigate(href, { scrollToTop });
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
