import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTermsStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import Modal from './Modal';
import useCookie from '../useCookie';

export default function TermsAndConditions() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasRejected, setHasRejected] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [, setUsernameCookie] = useCookie('username');
  const [termsStrings, setTermsStrings] = useState({});

  // Fetch terms strings from Sanity on mount and language change
  useEffect(() => {
    async function loadTermsStrings() {
      try {
        const strings = await getTermsStrings(language);
        setTermsStrings(strings);
      } catch (error) {
        console.error('Failed to load terms strings:', error);
        // Language-aware fallback
        setTermsStrings({
          modalTitle: getDefault('terms', 'modalTitle', language),
          buttonAccept: getDefault('terms', 'buttonAccept', language),
          buttonReject: getDefault('terms', 'buttonReject', language),
          buttonAccessFirewall: getDefault('terms', 'buttonAccessFirewall', language),
          errorMustAccept: getDefault('terms', 'errorMustAccept', language),
          errorUsernameTooLong: getDefault('terms', 'errorUsernameTooLong', language),
          errorUsernameInvalidChars: getDefault('terms', 'errorUsernameInvalidChars', language),
          usernamePrompt: getDefault('terms', 'usernamePrompt', language),
          usernamePlaceholder: getDefault('terms', 'usernamePlaceholder', language),
          termsParagraph1Bold: getDefault('terms', 'termsParagraph1Bold', language),
          termsParagraph1: getDefault('terms', 'termsParagraph1', language),
          termsParagraph2Bold: getDefault('terms', 'termsParagraph2Bold', language),
          termsParagraph2: getDefault('terms', 'termsParagraph2', language),
          termsParagraph3: getDefault('terms', 'termsParagraph3', language),
          termsParagraph4: getDefault('terms', 'termsParagraph4', language),
        });
      }
    }

    loadTermsStrings();
  }, [language]);

  useEffect(() => {
    // Check if user has seen the terms before
    const hasSeenTerms = localStorage.getItem('hasSeenTerms');
    if (!hasSeenTerms || hasSeenTerms === 'false') {
      setIsOpen(true);
    }
  }, []);

  const generateRandomUsername = () => {
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `user${randomNum}`;
  };

  const handleReject = () => {
    localStorage.setItem('hasSeenTerms', 'false');
    setHasRejected(true);
    setShowUsernameInput(false);
    setUsername('');
    setUsernameError('');
  };

  const handleAccept = () => {
    setShowUsernameInput(true);
    setHasRejected(false);
    setUsernameError('');
  };

  const validateUsername = value => {
    if (value.length > 30) {
      setUsernameError(termsStrings.errorUsernameTooLong || getDefault('terms', 'errorUsernameTooLong', language));
      return false;
    }
    if (value.length > 0 && !/^\w+$/.test(value)) {
      setUsernameError(termsStrings.errorUsernameInvalidChars || getDefault('terms', 'errorUsernameInvalidChars', language));
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameChange = e => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handleAccessFirewall = () => {
    let finalUsername = username;

    // If username is empty, generate a random one
    if (!username.trim()) {
      finalUsername = generateRandomUsername();
      setUsername(finalUsername);
    }

    // Validate username before proceeding
    if (!validateUsername(finalUsername)) {
      return;
    }

    localStorage.setItem('hasSeenTerms', 'true');

    // Set cookie with max expiration (effectively never expires)
    const maxDate = new Date('9999-12-31');
    setUsernameCookie(finalUsername, maxDate);

    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleReject}
      onUpdate={showUsernameInput ? handleAccessFirewall : handleAccept}
      updateButtonText={showUsernameInput
        ? (termsStrings.buttonAccessFirewall || getDefault('terms', 'buttonAccessFirewall', language))
        : (termsStrings.buttonAccept || getDefault('terms', 'buttonAccept', language))
      }
      clearButtonText={termsStrings.buttonReject || getDefault('terms', 'buttonReject', language)}
      title={termsStrings.modalTitle || getDefault('terms', 'modalTitle', language)}
      allowOutsideClick={false}
      showCloseButton={false}
    >
      <div className="p-2">
        {hasRejected && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
            <p className="font-bold">
              {termsStrings.errorMustAccept || getDefault('terms', 'errorMustAccept', language)}
            </p>
          </div>
        )}
        <div className="prose">
          {showUsernameInput ? (
            <div className="mb-4">
              <p className="text-sm mb-4">
                {termsStrings.usernamePrompt || getDefault('terms', 'usernamePrompt', language)}
              </p>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder={termsStrings.usernamePlaceholder || getDefault('terms', 'usernamePlaceholder', language)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  usernameError ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={30}
              />
              {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
            </div>
          ) : (
            <>
              <p className="text-sm mb-4">
                <span className="font-bold">
                  {termsStrings.termsParagraph1Bold || getDefault('terms', 'termsParagraph1Bold', language)}
                </span>{' '}
                {termsStrings.termsParagraph1 || getDefault('terms', 'termsParagraph1', language)}
              </p>

              <p className="text-sm mb-4">
                <span className="font-bold">
                  {termsStrings.termsParagraph2Bold || getDefault('terms', 'termsParagraph2Bold', language)}
                </span>{' '}
                {termsStrings.termsParagraph2 || getDefault('terms', 'termsParagraph2', language)}
              </p>

              <p className="text-sm mb-4">
                {termsStrings.termsParagraph3 || getDefault('terms', 'termsParagraph3', language)}
              </p>

              <p className="text-sm mb-4">
                {termsStrings.termsParagraph4 || getDefault('terms', 'termsParagraph4', language)}
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
