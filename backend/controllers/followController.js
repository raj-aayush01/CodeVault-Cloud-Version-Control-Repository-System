const User = require("../models/userModel");

const toggleFollow = async (req, res) => {
  try {
    const followerId = req.user;           
    const { userId: followingId } = req.params; 

    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower) return res.status(404).json({ message: "Follower not found" });
    if (!following) return res.status(404).json({ message: "User not found" });

    const alreadyFollowing = follower.followedUsers.some(
      (id) => id.toString() === followingId.toString()
    );

    if (alreadyFollowing) {
      // ── UNFOLLOW ──
      await User.findByIdAndUpdate(
        followerId,
        { $pull: { followedUsers: followingId } }
      );

      return res.status(200).json({ message: "Unfollowed successfully" });

    } else {
      // ── FOLLOW ──
      await User.findByIdAndUpdate(
        followerId,
        { $push: { followedUsers: followingId } }
      );

      return res.status(200).json({ message: "Followed successfully" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getFollowData = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("followedUsers", "-password") 
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });


    const followers = await User.find(
      { followedUsers: userId }
    ).select("-password");

    res.status(200).json({
      following: user.followedUsers, 
      followers: followers,          
      followingCount: user.followedUsers.length,
      followerCount: followers.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { toggleFollow, getFollowData };