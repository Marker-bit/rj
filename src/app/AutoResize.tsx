"use client";

import React, { useState, useRef, useEffect } from "react";

const AutoResizeInput = ({
  onChange,
  ...props
}: { onChange?: () => void } & any) => {
  const [value, setValue] = useState("");
  const [width, setWidth] = useState("auto");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (inputRef.current.value.length === 0) {
        setWidth("1ch");
      } else {
        setWidth(`${inputRef.current.value.length}ch`);
      }
    }
  }, [value]);

  const handleChange = (event: any) => {
    if (isNaN(event.target.value)) return;
    setValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <input
      {...props}
      ref={inputRef}
      value={value}
      onChange={handleChange}
      style={{ width: width, overflowY: "hidden", resize: "none" }}
    />
  );
};

export default AutoResizeInput;
