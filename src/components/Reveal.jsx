import { useReveal } from "../hooks/useReveal.js";

/**
 * Wraps `useReveal` in a component so it can be used inside `.map()` callbacks
 * without breaking the Rules of Hooks. Each <Reveal> owns its own observer.
 *
 * @param {object}   props
 * @param {keyof JSX.IntrinsicElements} [props.as] Tag to render. Default "div".
 * @param {number}   [props.delay]     Transition delay in ms, for staggering.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}) {
  const { ref, className: revealClass } = useReveal();

  return (
    <Tag
      ref={ref}
      className={`${revealClass}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
