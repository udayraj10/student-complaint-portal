import React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import logo from '../../assets/images/logo.png'
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section footer-brand">
                    <div className="footer-brand-text">
                        <h3>Sri Venkateswara University</h3>
                        <p>Accredited by NAAC with A+ Grade</p>
                    </div>
                </div>

                <div className="footer-section footer-contact">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <MapPin size={16} />
                        <span>Prakasam Road, Tirupati, Andhra Pradesh, 517502</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} />
                        <span>+91 (877) 2289545</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={16} />
                        <span>registrarsvu@gmail.com</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 1954-2025. Sri Venkateswara University All Rights Reserved</p>
            </div>
        </footer>
    )
}

export default Footer
