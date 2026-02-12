# Cook-your-friends
Shade notes: unit is the average of the height and width of the screen, use it for all scaling and co-ordinates.

shade notes: original code attempted to make many coordinates relative to the center of the screen, however this was very buggy and confusing due to my making a robust system that allows the screen to work in any aspect ratio and be adjustabe live.

shade notes: unit was a really bad idea and caused bars on the top and bottom of the screen if not perfectly square, code has been reworked to use absolute coordinates and then modify their position as rendered while the real level isnt rendered, zoom is dynamic, resizing the window does not appear to move sprites differently and zoom is handeled by using a subsection of the background instead of rendering the whole thing offset and larger.

shade notes: mac dosent care about capitals in filenames so if switching to windows or linux and getting odd loading errors it could be because a file is referenced wrong.


