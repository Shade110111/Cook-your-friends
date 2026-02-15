# Cook-your-friends
Shade notes: unit is the average of the height and width of the screen, use it for all scaling and co-ordinates.

shade notes: original code attempted to make many coordinates relative to the center of the screen, however this was very buggy and confusing due to my making a robust system that allows the screen to work in any aspect ratio and be adjustabe live.

shade notes: unit was a really bad idea and caused bars on the top and bottom of the screen if not perfectly square, code has been reworked to use absolute coordinates and then modify their position as rendered while the real level isnt rendered, zoom is dynamic, resizing the window does not appear to move sprites differently and zoom is handeled by using a subsection of the background instead of rendering the whole thing offset and larger.

shade notes: mac dosent care about capitals in filenames so if switching to windows or linux and getting odd loading errors it could be because a file is referenced wrong.

shade notes: the original map has small corridoors and ramps, these would be fine if I could get sliding collision working that takes the component of the force, however as this would require normals for a collision mesh which would be quite costly and difficult to impliment I have opted for a more simple form of collision that stops illegal displacement, this however makes the walls feel sticky instead of slidey and so I have requested that the small corridoors be replaced with wider ones so the player is less likely to be annoyed by them.


