/**
 * This file is generated
 **/import Cross from "./Cross";

import { MouseEvent, SVGProps } from "react";
 export type IconProps = { name: IconNames } & IconNamedProps & (IconNamedProps["name"] extends "copy" ? { check?: boolean } : {});

export type IconNamedProps = SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: MouseEvent) => void;
  title: string;
  check?: boolean;
  mirror?: boolean;
};
export const defaultHeight = 24;
export type IconNames = 
   "raz-cross";
const Icon = ({ name, ...rest }: IconProps) => {
    switch (name) {
  case "raz-cross": return <Cross {...rest} />;
default: return <></>;
}};
export default Icon;
