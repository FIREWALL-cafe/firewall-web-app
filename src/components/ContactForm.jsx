import React, { useState } from 'react';

const ContactForm = () => {
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const subscribe = document.getElementById('subscribe').checked;

    const text = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\nSubscribe: ${subscribe}`;
    const config = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'info@firewallcafe.com',
        subject: 'Firewall Cafe NYC 2024',
        text: text,
      }),
    };
    // submitting form
    const response = await fetch(`/send-email`, config);
    const data = await response.json();
    setAlertMessage(response.ok ? 'Message sent successfully!' : (data.error || 'Failed to send message.'));
    setDisplayAlert(true);
  };

  return (
    <form className="flex flex-col p-6 md:p-8 mt-2 bg-white rounded-lg border border-red-600 border-solid w-full">
      <div id="alert" className={`text-center bg-blue ${displayAlert ? '' : 'hidden'}`}>
        {alertMessage}
      </div>
      <div className="flex flex-col w-full space-y-6">
        {/* Name Field */}
        <div className="flex flex-col w-full">
          <div className="flex gap-1 items-center mb-2">
            <label htmlFor="name" className="text-lg text-red-500">
              Name
            </label>
            <span className="text-lg text-red-500">*</span>
          </div>
          <input
            type="text"
            id="name"
            required
            className="w-full border-b border-solid border-b-red-300 py-2 bg-transparent focus:border-b-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col w-full">
          <div className="flex gap-1 items-center mb-2">
            <label htmlFor="email" className="text-lg text-red-500">
              Email address
            </label>
            <span className="text-lg text-red-500">*</span>
          </div>
          <input
            type="email"
            id="email"
            required
            className="w-full border-b border-solid border-b-red-300 py-2 bg-transparent focus:border-b-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Subject Field */}
        <div className="flex flex-col w-full">
          <div className="flex gap-1 items-center mb-2">
            <label htmlFor="subject" className="text-lg text-red-500">
              Subject
            </label>
            <span className="text-lg text-red-500">*</span>
          </div>
          <input
            type="text"
            id="subject"
            required
            className="w-full border-b border-solid border-b-red-300 py-2 bg-transparent focus:border-b-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Message Field */}
        <div className="flex flex-col w-full">
          <div className="flex gap-1 items-center mb-2">
            <label htmlFor="message" className="text-lg text-red-500">
              Message
            </label>
            <span className="text-lg text-red-500">*</span>
          </div>
          <textarea
            id="message"
            required
            className="w-full bg-gray-50 border border-solid border-red-300 rounded p-3 min-h-[100px] focus:border-red-600 focus:outline-none transition-colors resize-vertical"
            placeholder=""
          />
        </div>
      </div>
      {/* Newsletter Subscription */}
      <div className="flex gap-3 items-center mt-6 text-lg">
        <input
          type="checkbox"
          id="subscribe"
          className="w-5 h-5 border border-solid border-red-400 rounded focus:ring-2 focus:ring-red-600"
        />
        <label htmlFor="subscribe" className="text-red-500 cursor-pointer">
          Subscribe to newsletter?
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="self-start flex gap-2 items-center px-6 py-2 mt-6 text-lg font-medium text-red-600 bg-white rounded border border-red-600 border-solid hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
        onClick={handleSubmit}
      >
        Send
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
};

export default ContactForm;
