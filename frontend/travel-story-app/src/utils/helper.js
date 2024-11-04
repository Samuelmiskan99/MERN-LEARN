import ADD_STORY_IMG from '../../src/assets/images/add-story.jpg'
import NO_SEARCH_IMG from '../../src/assets/images/no-search.jpg'
import NO_FILTER_IMG from '../../src/assets/images/nothing-here.svg'

export const validateEmail = (email) => {
   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
   return emailRegex.test(email)
}

export const getInitials = (name) => {
   if (!name) return ''
   const words = name.split(' ')
   let initials = ''
   for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0].toUpperCase()
   }
   return initials
}

export const getEmptyCardMessage = (filterType) => {
   switch (filterType) {
      case 'search':
         return 'No no no no, No stories matchin your search buddy. try another story!'
      case 'date':
         return 'No stories in the given date range bud ?, try another!'
      default:
         return `Start creating your first travel story!. you can just click on the add button to write down  your travel story and share with us your journey and memories. Let's get started`
   }
}

export const getEmptyCardImage = (filterType) => {
   switch (filterType) {
      case 'search':
         return NO_SEARCH_IMG
      case 'date':
         return NO_FILTER_IMG
      default:
         return ADD_STORY_IMG
   }
}
