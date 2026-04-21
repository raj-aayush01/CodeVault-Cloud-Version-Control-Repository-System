const User = require("../models/userModel");

// 🔁 TOGGLE FOLLOW / UNFOLLOW
const toggleFollow = async (req, res) => {
  try {
    // ✅ handle both cases (req.user OR req.user.id)
    const followerId = req.user.id || req.user;
    const { userId: followingId } = req.params;

    // ❌ prevent self-follow
    if (followerId.toString() === followingId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower) {
      return res.status(404).json({ message: "Follower not found" });
    }

    if (!following) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = follower.followedUsers.some(
      (id) => id.toString() === followingId.toString()
    );

    if (alreadyFollowing) {
      // 🔴 UNFOLLOW

      await User.findByIdAndUpdate(
        followerId,
        { $pull: { followedUsers: followingId } }
      );

      await User.findByIdAndUpdate(
        followingId,
        { $pull: { followers: followerId } }
      );

      // return updated followers (important for frontend toggle)
      const updatedUser = await User.findById(followingId).select("followers");

      return res.status(200).json({
        message: "Unfollowed successfully",
        followers: updatedUser.followers
      });

    } else {
      // 🟢 FOLLOW (safe — no duplicates)

      await User.findByIdAndUpdate(
        followerId,
        { $addToSet: { followedUsers: followingId } }
      );

      await User.findByIdAndUpdate(
        followingId,
        { $addToSet: { followers: followerId } }
      );

      const updatedUser = await User.findById(followingId).select("followers");

      return res.status(200).json({
        message: "Followed successfully",
        followers: updatedUser.followers
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📊 GET FOLLOW DATA
const getFollowData = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("followedUsers", "-password")
      .populate("followers", "-password")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      following: user.followedUsers,
      followers: user.followers,
      followingCount: user.followedUsers.length,
      followerCount: user.followers.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { toggleFollow, getFollowData };