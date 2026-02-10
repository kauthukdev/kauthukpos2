export default function ApplicationLogo(props) {
    // Determine if this is being used in the sidebar based on className
    const isSidebar = props.className && props.className.includes('h-9');
    
    // Create a merged style object that combines the default styles with any passed in props
    const logoStyle = {
        maxWidth: isSidebar ? '120px' : '180px',
        objectFit: 'contain',
        height: 'auto',
        margin: isSidebar ? '0 auto' : undefined,
        padding: isSidebar ? '2px 0' : undefined,
        ...props.style
    };
    
    return (
        <img
            src="/images/logo.png"
            alt="Kauthuk Logo"
            style={logoStyle}
            {...props}
            className={`${props.className || ''}`}
        />
    );
}
