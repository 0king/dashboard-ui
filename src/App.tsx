import { ThemeProvider } from "@/components/theme-provider";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Home from '@/components/mine/Home'

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Home />
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
