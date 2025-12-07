import { useState } from 'react'
import '../assets/styles/pages/HelpCenter.css'

export function HelpCenter() {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  const faqData = {
    guests: [
      {
        question: 'How do I book a stay?',
        answer: 'Browse our listings, select your dates, choose the number of guests, and click "Reserve". You\'ll be asked to provide payment information and confirm your booking.'
      },
      {
        question: 'What is the cancellation policy?',
        answer: 'Cancellation policies vary by listing. Check the specific listing\'s cancellation policy before booking. Most hosts offer flexible, moderate, or strict cancellation options.'
      },
      {
        question: 'How do I contact my host?',
        answer: 'Once your booking is confirmed, you can message your host directly through the chat feature in your reservation details.'
      },
      {
        question: 'What if I need to modify my reservation?',
        answer: 'Go to your trips, select the reservation you want to change, and click "Change reservation". Note that modifications are subject to the host\'s approval and availability.'
      }
    ],
    hosts: [
      {
        question: 'How do I list my property?',
        answer: 'Click "Become a Host" in the navigation menu. You\'ll be guided through the process of adding photos, setting your price, and describing your space.'
      },
      {
        question: 'How do I set my pricing?',
        answer: 'You can set a base price per night and adjust for weekends, seasons, or special events. We recommend researching similar listings in your area.'
      },
      {
        question: 'What are my hosting responsibilities?',
        answer: 'Hosts are responsible for providing a clean, safe space that matches the listing description, responding to guests promptly, and following local laws and regulations.'
      },
      {
        question: 'How do I handle guest reviews?',
        answer: 'After each stay, both you and your guest can leave a review. Reviews are published simultaneously to ensure honest feedback.'
      }
    ],
    payments: [
      {
        question: 'When will I be charged?',
        answer: 'For reservations, you\'ll be charged immediately upon booking confirmation. The amount includes the nightly rate, cleaning fee, service fee, and any applicable taxes.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, debit cards, and various digital payment methods. Google Pay is also available for quick checkout.'
      },
      {
        question: 'How do hosts receive payments?',
        answer: 'Hosts receive payment approximately 24 hours after guest check-in. Payments are transferred to your designated bank account or payment method.'
      },
      {
        question: 'Are there any service fees?',
        answer: 'Yes, guests pay a service fee (typically 10-15% of the booking subtotal), and hosts pay a host service fee (typically 3% of the booking subtotal).'
      }
    ],
    safety: [
      {
        question: 'How do you verify users?',
        answer: 'We verify users through email confirmation, phone verification, and government ID verification. Hosts and guests can also connect through Google authentication.'
      },
      {
        question: 'What if something goes wrong during my stay?',
        answer: 'Contact your host first to resolve any issues. If you can\'t reach a resolution, contact our support team immediately for assistance.'
      },
      {
        question: 'Is there a way to report suspicious activity?',
        answer: 'Yes, you can report suspicious listings or users directly through our platform. Your safety is our top priority.'
      },
      {
        question: 'What safety features do you provide?',
        answer: 'We provide secure payment processing, verified user profiles, 24/7 customer support, and a review system to build trust in our community.'
      }
    ]
  }

  return (
    <div className="help-center">
      <div className="help-header">
        <h1>Help Center</h1>
        <p>Find answers to common questions and get support</p>
      </div>

      <div className="help-content">
        <section className="help-section">
          <h2 onClick={() => toggleSection('guests')} className="section-title">
            <span>For Guests</span>
            <span className={`arrow ${openSection === 'guests' ? 'open' : ''}`}>▼</span>
          </h2>
          {openSection === 'guests' && (
            <div className="faq-list">
              {faqData.guests.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="help-section">
          <h2 onClick={() => toggleSection('hosts')} className="section-title">
            <span>For Hosts</span>
            <span className={`arrow ${openSection === 'hosts' ? 'open' : ''}`}>▼</span>
          </h2>
          {openSection === 'hosts' && (
            <div className="faq-list">
              {faqData.hosts.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="help-section">
          <h2 onClick={() => toggleSection('payments')} className="section-title">
            <span>Payments & Pricing</span>
            <span className={`arrow ${openSection === 'payments' ? 'open' : ''}`}>▼</span>
          </h2>
          {openSection === 'payments' && (
            <div className="faq-list">
              {faqData.payments.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="help-section">
          <h2 onClick={() => toggleSection('safety')} className="section-title">
            <span>Safety & Security</span>
            <span className={`arrow ${openSection === 'safety' ? 'open' : ''}`}>▼</span>
          </h2>
          {openSection === 'safety' && (
            <div className="faq-list">
              {faqData.safety.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* <section className="contact-support">
          <h2>Still need help?</h2>
          <p>Our support team is available 24/7 to assist you</p>
          <div className="contact-options">
            <button className="contact-btn">
              <span>📧</span>
              <span>Contact Support</span>
            </button>
            <button className="contact-btn">
              <span>💬</span>
              <span>Live Chat</span>
            </button>
          </div>
        </section> */}
      </div>
    </div>
  )
}
