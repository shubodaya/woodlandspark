export function isInternalPath(href) {
  return href && href.startsWith("/");
}

export function AppLink({ href, children, onNavigate, className = "", ...props }) {
  const handleClick = (event) => {
    if (!isInternalPath(href) || !onNavigate || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate?.(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
