import Link from 'next/link';

const exercises = [
  {
    title: 'Antipatterns',
    description: 'Common state management mistakes',
    href: '/exercise-antipatterns',
    icon: '🚫',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
  },
  {
    title: 'Diagrams',
    description: 'State visualization techniques',
    href: '/exercise-diagrams',
    icon: '📊',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
  {
    title: 'Finite States',
    description: 'Combining state patterns',
    href: '/exercise-finite',
    icon: '🔄',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  },
  {
    title: 'Reducers',
    description: 'Building with useReducer',
    href: '/exercise-reducer',
    icon: '⚙️',
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
  {
    title: 'Forms',
    description: 'Form handling',
    href: '/exercise-form',
    icon: '📝',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
  },
  {
    title: 'URL State',
    description: 'URL state synchronization',
    href: '/exercise-url',
    icon: '🔗',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  },
  {
    title: 'Data Fetching',
    description: 'Data fetching patterns',
    href: '/exercise-fetch',
    icon: '📡',
    color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
  },
  {
    title: 'Effects',
    description: 'Refactoring cascading useEffects',
    href: '/exercise-effects',
    icon: '⚡',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  },
  {
    title: 'Synchronization',
    description: 'Synchronization patterns',
    href: '/exercise-sync',
    icon: '🔄',
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
  },
  {
    title: 'Testing',
    description: 'Testing state management',
    href: '/exercise-test',
    icon: '🧪',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
  },
  {
    title: 'Normalization',
    description: 'Data normalization',
    href: '/exercise-normalization',
    icon: '🗂️',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
  },
  {
    title: 'Libraries',
    description: 'State management libraries',
    href: '/exercise-libraries',
    icon: '📚',
    color: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
  },
];

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Frontend Masters State Workshop
          </h1>
        </div>

        {/* Exercise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <Link
              key={exercise.href}
              href={exercise.href}
              className={`block p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${exercise.color}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0">{exercise.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">
                    {exercise.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {exercise.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
