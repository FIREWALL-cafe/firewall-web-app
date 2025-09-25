import React from 'react';

function TimelineItems() {
  const timelineEvents = [
    '1989: June 4th, known as the Tiananmen Square Incident, is a collective trauma for a generation of people, yet it remains a taboo topic in China. The crackdown, where People’s Liberation Army soldiers opened fire on unarmed pro-democracy protesters, killing hundreds, drove the CCP to implement strict censorship (and eventually create the Great Firewall).',
    '1991: The World Wide Web, developed by British computer scientist Tim Berners-Lee, was launched to the public, signifying the birth of the internet. At that time, Berners-Lee was working at the European Council for Nuclear Research (CERN), founded in 1954.',
    '1994: Chinese Academy of Sciences (CAS) Institute of High Energy Physics (IHEP) built the first cable connected to the World Wide Web, marking China’s first connection with the Internet.',
    '1995: The U.S. Supreme Court case McIntyre v. Ohio Elections Commission reinforced the right to anonymous political speech, a key aspect of the First Amendment.',
    '1996: China issued “Temporary Regulations Governing Computer Information Networks and the Internet” in order to ban unauthorized network access. The U.S. enacted the Communications Decency Act (CDA) to regulate online content.',
    '1997: In the case of Reno vs. American Civil Liberties Union case, the U.S. Supreme Court affirmed that the internet is entitled to the same level of First Amendment protection as print media.',
    '1998: China had approximately 2.1 million internet users, and the U.S. boasted over 75 million.',
    '2001: Following the 9/11 terrorist attacks, the U.S. government took a direct legislative approach to increase surveillance capabilities. The Electronic Communication Transactional Records Act of 1996 and the USA PATRIOT Act of 2001 expanded governmental powers under the guise of national security.',
    '2003: The Golden Shield project, known as the “Great Firewall of China” was launched. A significant blockade of Google occurred following the activation.',
    '2005: Journalist Shi Tao was sentenced to 10 years in prison after Yahoo shared his information with Chinese authorities. A year earlier, he had used his Yahoo email to send details of a government directive to downplay the 15th anniversary of the Tiananmen Square crackdown to Cary S. Hung, the co-founder of Taiwan Revolutionary Party.',
    '2009: Following violent clashes in Xinjiang between Uyghur and Han Chinese populations, the Chinese government responded by shutting down internet access in the region for several months. The violence was a turning point that led to increased security measures and tighter information controls in Xinjiang.',
    '2010: Google effectively withdrew its search engine from mainland China.  This withdrawal happened after Google discovered that Chinese hackers had attacked the company’s corporate infrastructure in an attempt to access the Gmail accounts of human rights activists.',
    '2011: The Wenzhou high-speed rail crash was a turning point for China’s internet censorship and media control, as it sparked one of the boldest public online challenges to authority. In the following years, China’s most daring news outlets questioning public power faced increasing suppression and censorship.',
    '2020: Beijing passed the Hong Kong National Security Law in response to the previous year’s protests. The law effectively criminalizes dissent by broadening the definitions of crimes like terrorism, subversion, secession, and collusion with foreign powers, creating a strong incentive for self-censorship.',
    '2022: The White Paper movement in China emerged as a powerful protest against the suppression of free speech and the harsh Zero-COVID policy. Sparked by the tragic Urumqi fire, seen as a consequence of strict lockdowns, protesters across the country held up blank sheets of paper, symbolizing what they were forbidden to express, even calling for President Xi to step down.',
    '2023: The Anti-espionage Law was enacted in mainland China. The law broadens the definition of “espionage”, granting authorities greater power to punish perceived threats to national security. Its vague terms, including “relying on espionage organizations” and unauthorized access to “documents, data, and materials,” create a chilling effect on Chinese citizens who engage with foreigners or foreign organizations.',
    '2024: U.S. Congress passed the TikTok sell-or-ban bill, signaling tighter government control over social media amid rising concerns about data security and foreign influence. France arrested the Telegram CEO Pavel Durov for refusing to provide user information tied to suspected cyber crime.',
  ];

  return (
    <div>
      {timelineEvents.map((event, index) => (
        <div key={index}>
          <p>{event}</p>
        </div>
      ))}
    </div>
  );
}

export default TimelineItems;
