const color = {
  'very-light-neutral': { bgColor: 'bg-neutral-200', selectedColor: 'ring-neutral-200' },
  'light-neutral': { bgColor: 'bg-neutral-300', selectedColor: 'ring-neutral-300' },
  neutral: { bgColor: 'bg-neutral-500', selectedColor: 'ring-neutral-500' },
  'dark-neutral': { bgColor: 'bg-neutral-700', selectedColor: 'ring-neutral-700' },
  red: { bgColor: 'bg-red-500', selectedColor: 'ring-red-500' },
  orange: { bgColor: 'bg-orange-500', selectedColor: 'ring-orange-500' },
  amber: { bgColor: 'bg-amber-500', selectedColor: 'ring-amber-500' },
  yellow: { bgColor: 'bg-yellow-500', selectedColor: 'ring-yellow-500' },
  lime: { bgColor: 'bg-lime-500', selectedColor: 'ring-lime-500' },
  green: { bgColor: 'bg-green-500', selectedColor: 'ring-green-500' },
  emerald: { bgColor: 'bg-emerald-500', selectedColor: 'ring-emerald-500' },
  teal: { bgColor: 'bg-teal-500', selectedColor: 'ring-teal-500' },
  cyan: { bgColor: 'bg-cyan-500', selectedColor: 'ring-cyan-500' },
  sky: { bgColor: 'bg-sky-500', selectedColor: 'ring-sky-500' },
  blue: { bgColor: 'bg-blue-500', selectedColor: 'ring-blue-500' },
  indigo: { bgColor: 'bg-indigo-500', selectedColor: 'ring-indigo-500' },
  violet: { bgColor: 'bg-violet-500', selectedColor: 'ring-violet-500' },
  purple: { bgColor: 'bg-purple-500', selectedColor: 'ring-purple-500' },
  fuchsia: { bgColor: 'bg-fuchsia-500', selectedColor: 'ring-fuchsia-500' },
  pink: { bgColor: 'bg-pink-500', selectedColor: 'ring-pink-500' },
  rose: { bgColor: 'bg-rose-500', selectedColor: 'ring-rose-500' },
}

const emoji = {
  'grinning-face': '😀',
  'grinning-face-with-big-eyes': '😃',
  'grinning-face-with-smiling-eyes': '😄',
  'beaming-face-with-smiling-eyes': '😁',
  'grinning-squinting-face': '😆',
  'grinning-face-with-sweat': '😅',
  'rolling-on-the-floor-laughing': '🤣',
  'face-with-tears-of-joy': '😂',
  'slightly-smiling-face': '🙂',
  'upside-down-face': '🙃',
  'winking-face': '😉',
  'smiling-face-with-smiling-eyes': '😊',
  'smiling-face-with-halo': '😇',
  'smiling-face-with-hearts': '🥰',
  'smiling-face-with-heart-eyes': '😍',
  'star-struck': '🤩',
  'face-blowing-a-kiss': '😘',
  'kissing-face': '😗',
  'smiling-face': '☺️',
  'kissing-face-with-closed-eyes': '😚',
  'kissing-face-with-smiling-eyes': '😙',
  'smiling-face-with-tear': '🥲',
  'face-savoring-food': '😋',
  'face-with-tongue': '😛',
  'winking-face-with-tongue': '😜',
  'zany-face': '🤪',
  'squinting-face-with-tongue': '😝',
  'money-mouth-face': '🤑',
  'hugging-face': '🤗',
  'face-with-hand-over-mouth': '🤭',
  'shushing-face': '🤫',
  'thinking-face': '🤔',
  'zipper-mouth-face': '🤐',
  'face-with-raised-eyebrow': '🤨',
  'neutral-face': '😐',
  'expressionless-face': '😑',
  'face-without-mouth': '😶',
  'smirking-face': '😏',
  'unamused-face': '😒',
  'face-with-rolling-eyes': '🙄',
  'grimacing-face': '😬',
  'lying-face': '🤥',
  'relieved-face': '😌',
  'pensive-face': '😔',
  'sleepy-face': '😪',
  'drooling-face': '🤤',
  'sleeping-face': '😴',
  'face-with-medical-mask': '😷',
  'face-with-thermometer': '🤒',
  'face-with-head-bandage': '🤕',
  'nauseated-face': '🤢',
  'face-vomiting': '🤮',
  'sneezing-face': '🤧',
  'hot-face': '🥵',
  'cold-face': '🥶',
  'woozy-face': '🥴',
  'dizzy-face': '😵',
  'exploding-head': '🤯',
  'cowboy-hat-face': '🤠',
  'partying-face': '🥳',
  'disguised-face': '🥸',
  'smiling-face-with-sunglasses': '😎',
  'nerd-face': '🤓',
  'face-with-monocle': '🧐',
  'confused-face': '😕',
  'worried-face': '😟',
  'slightly-frowning-face': '🙁',
  'frowning-face': '☹️',
  'face-with-open-mouth': '😮',
  'hushed-face': '😯',
  'astonished-face': '😲',
  'flushed-face': '😳',
  'pleading-face': '🥺',
  'frowning-face-with-open-mouth': '😦',
  'anguished-face': '😧',
  'fearful-face': '😨',
  'anxious-face-with-sweat': '😰',
  'sad-but-relieved-face': '😥',
  'crying-face': '😢',
  'loudly-crying-face': '😭',
  'face-screaming-in-fear': '😱',
  'confounded-face': '😖',
  'persevering-face': '😣',
  'disappointed-face': '😞',
  'downcast-face-with-sweat': '😓',
  'weary-face': '😩',
  'tired-face': '😫',
  'yawning-face': '🥱',
  'face-with-steam-from-nose': '😤',
  'pouting-face': '😡',
  'angry-face': '😠',
  'face-with-symbols-on-mouth': '🤬',
  'smiling-face-with-horns': '😈',
  'angry-face-with-horns': '👿',
  skull: '💀',

  'pile-of-poo': '💩',
  'clown-face': '🤡',
  ogre: '👹',
  goblin: '👺',
  ghost: '👻',
  alien: '👽',
  'alien-monster': '👾',
  robot: '🤖',
  'grinning-cat': '😺',
  'grinning-cat-with-smiling-eyes': '😸',
  'cat-with-tears-of-joy': '😹',
  'smiling-cat-with-heart-eyes': '😻',
  'cat-with-wry-smile': '😼',
  'kissing-cat': '😽',
  'weary-cat': '🙀',
  'crying-cat': '😿',
  'pouting-cat': '😾',
  'see-no-evil-monkey': '🙈',
  'hear-no-evil-monkey': '🙉',
  'speak-no-evil-monkey': '🙊',
  'kiss-mark': '💋',
  'love-letter': '💌',
  'heart-with-arrow': '💘',
  'heart-with-ribbon': '💝',
  'sparkling-heart': '💖',
  'growing-heart': '💗',
  'beating-heart': '💓',
  'revolving-hearts': '💞',
  'two-hearts': '💕',
  'heart-decoration': '💟',
  'broken-heart': '💔',
  'red-heart': '❤️',
  'orange-heart': '🧡',
  'yellow-heart': '💛',
  'green-heart': '💚',
  'blue-heart': '💙',
  'purple-heart': '💜',
  'brown-heart': '🤎',
  'black-heart': '🖤',
  'white-heart': '🤍',
  'hundred-points': '💯',
  'anger-symbol': '💢',
  collision: '💥',
  dizzy: '💫',
  'sweat-droplets': '💦',
  'dashing-away': '💨',
  hole: '🕳️',
  bomb: '💣',
  'speech-balloon': '💬',
  'eye-in-speech-bubble': '👁️‍🗨️',
  'left-speech-bubble': '🗨️',
  'right-anger-bubble': '🗯️',
  'thought-balloon': '💭',
  'white-medium-star': '⭐',
  'glowing-star': '🌟',
  'shooting-star': '🌠',
  'milky-way': '🌌',
  cloud: '☁️',
  'sun-behind-cloud': '⛅',
  'cloud-with-lightning-and-rain': '⛈️',
  'sun-behind-small-cloud': '🌤️',
  'sun-behind-large-cloud': '🌥️',

  frog: '🐸',
  crocodile: '🐊',
  turtle: '🐢',
  lizard: '🦎',
  snake: '🐍',
  'dragon-face': '🐲',
  dragon: '🐉',
  sauropod: '🦕',
  't-rex': '🦖',
  'spouting-whale': '🐳',
  whale: '🐋',
  dolphin: '🐬',
  fish: '🐟',
  'tropical-fish': '🐠',
  blowfish: '🐡',
  shark: '🦈',
  octopus: '🐙',
  'spiral-shell': '🐚',
  snail: '🐌',
  butterfly: '🦋',
  bug: '🐛',
  ant: '🐜',
  honeybee: '🐝',
  'lady-beetle': '🐞',
  cricket: '🦗',
  spider: '🕷️',
}

export { color, emoji }
