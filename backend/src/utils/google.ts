
export async function verifyGoogleToken(accessToken: string) {
  try {
    // 1. We use the Access Token to get the user's details directly from Google
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const payload = await response.json();

    if (!payload || !payload.email) {
      throw new Error("Invalid Google token or missing email");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    };
    
  } catch (error) {
    console.error("Error verifying Google Access Token:", error);
    throw new Error("Failed to verify Google token");
  }
}