// components/FireLetterDisplay.jsx
// Purpose: Hero-level F-I-R-E letter breakdown — each letter gets its own card
//   with the word it stands for and a 2-3 sentence explanation.
//   Visually prominent: large amber letter, word, description.
// Key exports: default FireLetterDisplay

const LETTERS = [
  {
    letter: 'F',
    word: 'Financial',
    description:
      'Building enough wealth that work becomes optional — not because you hate your job, but because you\'ve bought back the freedom to choose. Financial independence is a number, not a feeling.',
  },
  {
    letter: 'I',
    word: 'Independence',
    description:
      'Your portfolio covers your living expenses indefinitely. You no longer trade time for money. Independence means the stock market, not your employer, funds your life.',
  },
  {
    letter: 'R',
    word: 'Retire',
    description:
      'Stepping away from mandatory full-time work — usually decades earlier than the traditional age 65. In the FIRE community, "retire" often means pivoting to meaningful work, not stopping entirely.',
  },
  {
    letter: 'E',
    word: 'Early',
    description:
      'Most FIRE practitioners target their 30s, 40s, or early 50s. Early retirement requires aggressive savings rates (50–70%+), low spending, and high-return investments — but it\'s increasingly achievable on a middle-class income.',
  },
];

export default function FireLetterDisplay() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {LETTERS.map(({ letter, word, description }) => (
        <div
          key={letter}
          className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 space-y-3"
        >
          {/* Letter */}
          <div
            className="text-7xl font-black leading-none tabular"
            style={{ color: '#f0b429' }}
            aria-hidden="true"
          >
            {letter}
          </div>

          {/* Word */}
          <div className="text-base font-bold text-white">{word}</div>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
      ))}
    </div>
  );
}
