import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./ErrorPage";
import GlobalLoader from "./GlobalLoader";

type DataContentWrapperProps = {
  children: ReactNode;
};

export default function DataContentWrapper({
  children,
}: DataContentWrapperProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<GlobalLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
