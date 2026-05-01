"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface BaseProps {
  children: React.ReactNode;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const CredenzaContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: false,
});

const useCredenzaContext = () => {
  const context = React.useContext(CredenzaContext);
  if (!context) {
    throw new Error(
      "Credenza components cannot be rendered outside the Credenza Context",
    );
  }
  return context;
};

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const isDesktop = !useIsMobile();
  const CredenzaComponent = isDesktop ? Dialog : Drawer;
  const contextValue = React.useMemo(() => ({ isDesktop }), [isDesktop]);

  return (
    <CredenzaContext.Provider value={contextValue}>
      <CredenzaComponent {...props} {...(!isDesktop && { autoFocus: true })}>
        {children}
      </CredenzaComponent>
    </CredenzaContext.Provider>
  );
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <TriggerComponent className={className} {...props}>
      {children}
    </TriggerComponent>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const CloseComponent = isDesktop ? DialogClose : DrawerClose;

  return (
    <CloseComponent className={className} {...props}>
      {children}
    </CloseComponent>
  );
};

const CredenzaContent = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;

  return (
    <ContentComponent className={className} {...props}>
      {children}
    </ContentComponent>
  );
};

const CredenzaDescription = ({
  className,
  children,
  ...props
}: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const DescriptionComponent = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <DescriptionComponent className={className} {...props}>
      {children}
    </DescriptionComponent>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <HeaderComponent className={className} {...props}>
      {children}
    </HeaderComponent>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <TitleComponent className={className} {...props}>
      {children}
    </TitleComponent>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext();
  const FooterComponent = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <FooterComponent className={className} {...props}>
      {children}
    </FooterComponent>
  );
};

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
};
