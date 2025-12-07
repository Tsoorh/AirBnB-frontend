import { useSelector } from 'react-redux'
  import { useEffect, useState } from 'react'
  import { StayList } from '../cmps/StayList'
  import { stayService } from '../services/stay'
  import { updateUser } from '../store/actions/user.actions'
  import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

  export function Wishlist() {
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const [likedStays, setLikedStays] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      loadLikedStays()
    }, [loggedInUser?.liked])

    async function loadLikedStays() {
      if (!loggedInUser?.liked?.length) {
        setLikedStays([])
        setIsLoading(false)
        return
      }

      try {
        // Option 1: Load all stays and filter
        const allStays = await stayService.query({})
        const liked = allStays.filter(stay =>
          loggedInUser.liked.includes(stay._id)
        )
        setLikedStays(liked)

        // Option 2: Load stays by IDs (if you have this endpoint)
        // const liked = await Promise.all(
        //   loggedInUser.liked.map(id => stayService.getById(id))
        // )
        // setLikedStays(liked)

      } catch (err) {
        console.error('Failed to load wishlist:', err)
        showErrorMsg('Failed to load wishlist')
      } finally {
        setIsLoading(false)
      }
    }

    async function handleRemoveFromWishlist(stayId) {
      try {
        const updatedLiked = loggedInUser.liked.filter(id => id !== stayId)
        const updatedUser = { ...loggedInUser, liked: updatedLiked }

        await updateUser(updatedUser)
        showSuccessMsg('Removed from wishlist')
      } catch (err) {
        showErrorMsg('Failed to remove from wishlist')
      }
    }

    if (!loggedInUser) {
      return (
        <div className="wishlist-page">
          <h1>Please log in to view your wishlist</h1>
        </div>
      )
    }

    if (isLoading) {
      return <div className="wishlist-page">Loading...</div>
    }

    return (
      <div className="wishlist-page">
        <h1>Wishlist</h1>
        {likedStays.length === 0 ? (
          <p>No saved stays yet. Start exploring and save your favorites!</p>
        ) : (
          <StayList 
            stays={likedStays} 
            onToggleLike={handleRemoveFromWishlist}
            showLikeButton={true}
          />
        )}
      </div>
    )
  }