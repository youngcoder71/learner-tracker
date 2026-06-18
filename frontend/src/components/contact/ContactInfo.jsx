import "../../styles/contact.css";

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: "📞",
      label: "Phone",
      value: "+255 742 188 606",
      link: "tel:+255742188606",
    },
    {
      icon: "💬",
      label: "WhatsApp",
      value: "+255 742 188 606",
      link: "https://wa.me/255742188606",
    },
    {
      icon: "✉️",
      label: "Email",
      value: "fatumankhangaa@gmail.com",
      link: "mailto:fatumankhangaa@gmail.com",
    },
  ];

  return (
    <div className="contact-wrapper">
      <h2 className="contact-heading">Contact Us</h2>
      <ul className="contact-list">
        {contactDetails.map((contact, index) => (
          <li key={index} className="contact-list-item">
            <span className="contact-list-icon">{contact.icon}</span>
            <span className="contact-list-label">{contact.label}:</span>
            <a
              href={contact.link}
              target={contact.label === "WhatsApp" ? "_blank" : ""}
              rel={contact.label === "WhatsApp" ? "noopener noreferrer" : ""}
              className="contact-list-link"
            >
              {contact.value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactInfo;