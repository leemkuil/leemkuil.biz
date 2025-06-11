// src/data/cardData.js
const cardData = {
cardBackImage: {
    path: process.env.PUBLIC_URL + '/cards/card-back.png',
    alt: 'Card Back Design'
  },


  cards: [
    {
      path: process.env.PUBLIC_URL + '/cards/0_fool.png',
      title: 'The Fool',
      art: 'A carefree youth with a small bag steps toward a cliff, accompanied by a white dog.',
      text: 'Represents new beginnings, spontaneity, and blind faith. The Fool embodies unlimited potential but also naivety. His journey symbolizes stepping into the unknown with trust. A reminder that risk can lead to growth.',
      background: 'linear-gradient(to top, #FFD700, #87CEEB, #FFFFFF)',
      summary: 'Beginnings, Spontaneity, Potential'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/1_magician.png',
      title: 'The Magician',
      art: 'A figure stands at a table with a wand, cup, sword, and pentacle, pointing upward.',
      text: 'Mastery of skills, manifestation, and willpower. The Magician channels cosmic energy into tangible results. He signifies creativity, focus, and the power to transform ideas into reality. A call to act decisively.',
      background: 'linear-gradient(to top, #4B0082, #9370DB, #FFD700)',
      summary: 'Manifestation, Skill, Action'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/2_high_priestess.png',
      title: 'The High Priestess',
      art: 'A veiled woman sits between two pillars (Boaz and Jachin), holding a scroll labeled "Tora."',
      text: 'Intuition, hidden knowledge, and the subconscious. She guards secrets and mysteries beyond logic. The card urges listening to inner wisdom over external noise. Represents the balance between seen and unseen forces.',
      background: 'linear-gradient(to left, #191970, #6A5ACD, #E6E6FA)',
      summary: 'Intuition, Mystery, Secrets'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/3_empress.png',
      title: 'The Empress',
      art: 'A crowned woman sits amid a lush field, holding a scepter with a Venus symbol.',
      text: 'Fertility, nurturing, and abundance. The Empress embodies Mother Nature\'s creativity and sensual pleasures. She signifies growth, comfort, and unconditional love. A reminder to embrace beauty and generosity.',
      background: 'linear-gradient(to left, #FF69B4, #98FB98, #FFDAB9)',
      summary: 'Fertility, Nurturing, Abundance'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/4_emperor.png',
      title: 'The Emperor',
      art: 'A stern figure on a throne adorned with rams\' heads, holding an ankh and orb.',
      text: 'Authority, structure, and control. The Emperor represents leadership, discipline, and societal order. He balances power with responsibility, offering stability but warning against rigidity. A call to establish boundaries.',
      background: 'linear-gradient(to left, #8B0000 , #DAA520, #B8860B)',
      summary: 'Authority, Structure, Control'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/5_hierophant.png',
      title: 'The Hierophant',
      art: 'A religious figure in robes blesses two acolytes, holding a triple-cross scepter.',
      text: 'Tradition, spiritual guidance, and conformity. The Hierophant symbolizes teachings, rituals, and institutional wisdom. He bridges divine and human realms but may also represent dogma. Encourages learning from established systems.',
      background: 'linear-gradient(to left, #483D8B, #9370DB, #F5F5DC)',
      summary: 'Tradition, Wisdom, Guidance'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/6_lovers.png',
      title: 'The Lovers',
      art: 'A winged angel blesses a naked couple (Adam and Eve) with a mountain and serpent in the background.',
      text: 'Represents love, harmony, and moral choices. Symbolizes union, duality, and alignment of values. The card tests discernment between desire and higher purpose. A reminder that true connection requires conscious choice.',
      background: 'linear-gradient(to left, #FF1493, #FF8C00, #32CD32)',
      summary: 'Love, Choice, Harmony'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/7_chariot.png',
      title: 'The Chariot',
      art: 'A crowned warrior rides a chariot pulled by black and white sphinxes, adorned with celestial symbols.',
      text: 'Willpower, victory, and self-discipline. The charioteer masters opposing forces through control and focus. Signifies forward momentum despite challenges. Represents triumph through determination, but warns against arrogance.',
      background: 'linear-gradient(to left, #00008B, #00BFFF, #FFFFFF)',
      summary: 'Victory, Control, Momentum'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/8_strength.png',
      title: 'Strength',
      art: 'A woman gently closes a lion\'s jaws, crowned by an infinity symbol.',
      text: 'Inner strength, courage, and compassion. True power comes from patience and emotional resilience, not brute force. Taming the lion symbolizes mastering primal instincts. A lesson in gentle control over fear or anger.',
      background: 'linear-gradient(to left, #FF4500, #FFD700, #FFFFFF)',
      summary: 'Courage, Patience, Resilience'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/9_hermit.png',
      title: 'The Hermit',
      art: 'An old man holds a lantern and staff, standing alone on a mountain.',
      text: 'Solitude, introspection, and wisdom. The Hermit retreats to seek truth and share guidance. His lantern illuminates hidden answers. A call to slow down and listen to inner voice.',
      background: 'linear-gradient(to left, #2F4F4F, #778899, #F5F5F5)',
      summary: 'Wisdom, Reflection, Guidance'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/10_wheel_of_fortune.png',
      title: 'Wheel of Fortune',
      art: 'A wheel with angelic, animal, and mythical figures spins amid clouds.',
      text: 'Cycles, destiny, and change. Life\'s ups and downs are inevitable; adaptability is key. Represents luck, both good and bad. A reminder that all turns are temporary.',
      background: 'linear-gradient(to left, #9400D3, #4B0082, #FFD700)',
      summary: 'Change, Destiny, Cycles'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/11_justice.png',
      title: 'Justice',
      art: 'A crowned figure holds scales and a sword, seated between two pillars.',
      text: 'Fairness, truth, and accountability. Justice weighs actions and consequences impartially. Legal or ethical decisions loom. Karma—what is sown will be reaped.',
      background: 'linear-gradient(to left, #9400D3, #C0C0C0, #FFFFFF)',
      summary: 'Balance, Truth, Accountability'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/12_hanged_man.png',
      title: 'The Hanged Man',
      art: 'A man hangs upside-down from a tree, serene, with a golden halo.',
      text: 'Surrender, perspective shift, and sacrifice. Letting go leads to enlightenment. Voluntary pause for greater insight. Paradox: loss becomes gain.',
      background: 'linear-gradient(to left, #1E90FF, #00CED1, #7FFFD4)',
      summary: 'Release, Perspective, Sacrifice'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/13_death.png',
      title: 'Death',
      art: 'A skeletal knight rides a white horse, holding a black flag with a white rose.',
      text: 'Transformation, endings, and rebirth. Not literal death, but irreversible change. Out with the old to make way for new growth. Resistance is futile; embrace evolution.',
      background: 'linear-gradient(to left, #000000, #800000, #FFFFFF)',
      summary: 'Change, Endings, Rebirth'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/14_temperance.png',
      title: 'Temperance',
      art: 'An angel mixes water between two cups, one foot on land, one in water.',
      text: 'Balance, moderation, and alchemy. Blending opposites creates harmony. Patience and measured action yield healing. A middle path avoids extremes.',
      background: 'linear-gradient(to left, #4169E1, #00BFFF, #87CEFA)',
      summary: 'Harmony, Moderation, Synthesis'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/15_devil.png',
      title: 'The Devil',
      art: 'A horned figure presides over chained, naked humans.',
      text: 'Bondage, materialism, and shadow self. Chains are often self-imposed. Warns against toxic attachments or addictions. Liberation comes through awareness.',
      background: 'linear-gradient(to left, #800080, #FF0000, #000000)',
      summary: 'Subservience, Shadow, Temptation'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/16_tower.png',
      title: 'The Tower',
      art: 'Lightning strikes a crumbling tower, figures fall from its heights.',
      text: 'Sudden upheaval and revelation. False structures collapse to expose truth. Crisis sparks necessary change. Painful but liberating destruction.',
      background: 'linear-gradient(to left, #B22222, #FF4500, #FFD700)',
      summary: 'Upheaval, Revelation, Liberation'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/17_star.png',
      title: 'The Star',
      art: 'A naked woman pours water under a starry sky.',
      text: 'Hope, inspiration, and healing. Renewal after darkness. Trust in the universe\'s guidance. Open-hearted vulnerability leads to clarity.',
      background: 'linear-gradient(to left, #000080, #1E90FF, #E0FFFF)',
      summary: 'Hope, Renewal, Faith'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/18_moon.png',
      title: 'The Moon',
      art: 'A moon shines over a path with a dog, wolf, and crayfish.',
      text: 'Illusion, intuition, and the subconscious. Hidden fears or confusion surface. Navigate uncertainty with inner wisdom. Truth lurks beneath appearances.',
      background: 'linear-gradient(to left, #191970, #6A5ACD, #E6E6FA)',
      summary: 'Illusion, Intuition, Mystery'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/19_sun.png',
      title: 'The Sun',
      art: 'A child rides a white horse under a radiant sun.',
      text: 'Joy, success, and vitality. Pure, unshadowed energy. Growth, warmth, and childlike wonder. Life in its fullest expression.',
      background: 'linear-gradient(to left, #FF4500, #FFD700, #FFFF00)',
      summary: 'Joy, Success, Radiance'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/20_judgement.png',
      title: 'Judgement',
      art: 'Angels trumpet over rising figures from graves.',
      text: 'Awakening, reckoning, and rebirth. A call to higher purpose. Past actions culminate in renewal. Answering your true calling.',
      background: 'linear-gradient(to left, #9932CC, #BA55D3, #FFFFFF)',
      summary: 'Awakening, Reckoning, Purpose'
    },
    {
      path: process.env.PUBLIC_URL + '/cards/21_world.png',
      title: 'The World',
      art: 'A dancer floats within a laurel wreath, surrounded by an angel (water), an eagle (air), a bull (earth), and a lion (fire).',
      text: 'Completion, wholeness, and integration. Cycles conclude with mastery. Cosmic harmony and celebration. The Fool\'s journey fulfilled.',
      background: 'linear-gradient(to left, #228B22, #32CD32, #FFD700)',
      summary: 'Fulfillment, Unity, Completion'
    }
    
  ]};
  
  export default cardData;