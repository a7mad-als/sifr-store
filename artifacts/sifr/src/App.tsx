import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Checkout from '@/pages/checkout';
import Confirmation from '@/pages/confirmation';
import { CartDrawer, FavDrawer, Footer, Nav, QuickView } from '@/components/shell';
import { Assistant } from '@/components/assistant';
import { I18nProvider } from '@/lib/i18n';
import { StoreProvider } from '@/lib/store';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } } });

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/confirmation" component={Confirmation} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <StoreProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <div className="paper-grain min-h-[100dvh] bg-[#F6F1E7] text-[#1B2A41]">
                <Nav />
                <main className="relative z-[2]">
                  <Router />
                </main>
                <Footer />
                <CartDrawer />
                <FavDrawer />
                <QuickView />
                <Assistant />
              </div>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </StoreProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
