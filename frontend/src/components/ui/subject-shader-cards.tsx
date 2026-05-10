import React from 'react'

interface SubjectCardProps {
  code: string
  name: string
  onClick: () => void
  colorConfig: {
    hslColors: string[]
  }
}

interface SubjectShaderCardsProps {
  subjects: Array<{
    code: string
    name: string
  }>
  onSubjectClick: (subject: any) => void
}

const SubjectCard: React.FC<SubjectCardProps> = ({ code, name, onClick, colorConfig }) => {
  return (
    <div
      onClick={onClick}
      className="relative h-64 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${colorConfig.hslColors[0]} 0%, ${colorConfig.hslColors[1]} 100%)`,
      }}
    >
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div>
          <div className="text-sm font-semibold text-white/90 mb-1 tracking-wide uppercase">
            {code}
          </div>
          <h3 className="text-2xl font-bold text-white leading-snug">
            {name}
          </h3>
        </div>
      </div>
    </div>
  )
}

export const SubjectShaderCards: React.FC<SubjectShaderCardsProps> = ({ subjects, onSubjectClick }) => {
  const getShaderConfig = (index: number) => {
    const configs = [
      {
        hslColors: ['hsl(280, 80%, 28%)', 'hsl(300, 75%, 35%)'], // Dark Purple
      },
      {
        hslColors: ['hsl(190, 80%, 28%)', 'hsl(200, 75%, 35%)'], // Dark Cyan
      },
      {
        hslColors: ['hsl(120, 80%, 28%)', 'hsl(110, 75%, 35%)'], // Dark Green
      },
      {
        hslColors: ['hsl(39, 80%, 35%)', 'hsl(45, 75%, 40%)'], // Dark Orange
      },
      {
        hslColors: ['hsl(260, 80%, 28%)', 'hsl(270, 75%, 35%)'], // Dark Blue
      },
      {
        hslColors: ['hsl(330, 80%, 28%)', 'hsl(340, 75%, 35%)'], // Dark Pink
      },
    ]
    return configs[index % configs.length]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {subjects.map((subject, index) => (
        <SubjectCard
          key={`${subject.code}-${index}`}
          code={subject.code}
          name={subject.name}
          colorConfig={getShaderConfig(index)}
          onClick={() => onSubjectClick(subject)}
        />
      ))}
    </div>
  )
}

export default SubjectShaderCards
