"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useContext, useRef } from "react";

const variants = {
  inactive: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  out: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  in: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

function FrozenRouter(props: PropsWithChildren<{}>) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const Transition = ({ children }: { children: any }) => {
  const asPath = usePathname();
  return (
    <div className="effect-1">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={asPath}
          variants={variants}
          initial="in"
          animate="inactive"
          exit="out"
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Transition;
