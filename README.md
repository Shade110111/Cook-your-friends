# Cook-your-friends
Eat Your Friends

Live site: https://shade110111.github.io/EatYourFriends/
GitHub repo: https://github.com/Shade110111/EatYourFriends

Members: Shade(Edmond) Rickard, Mikaela, Morgan

number of unique sprites/lines of code are listed in brackets
Edmond Rickard (Shade):
all code (≈980 lines), touch ups on most art assets, all dialogue text (8), all customer art (7), all UI elements apart from the dialogue box (4), background music, yellow glow animation upon completing a recipe (12), player1 chopping animation (5),player1 cooking animation (9), player2 chopping animation (9), player2 cooking animation (9), bubble sprite, uncooked diced sugarpop sprite,  map art (3 layers for occlusion and grinder alt)

In Seong Wong (Mikaela):
green dialogue box art, all final dish art (7), most uncooked ground/chopped ingredient art (8), most cooked ground/chopped ingredient art (9), map prototype art (2), bubble sound effects (5), grinder sound effect

Mikaela + Shade collaborative work:
original idea, ground cooked cubloaf sprite, ground uncooked sugarpop sprite, sliced uncooked cubloaf sprite

Morgan:
original species designs (base ingredients) (5), player1 sprites (7), player2 sprites (7)

Introduction:
In our game 'Eat Your Friends' you play as two level 2 creatures (Boucher and Grillard) that must chop, grind and cook food for cannibalistic level 3 customers, the food you serve them are level 1 creatures and your goal (as a level 2) is to reach level 3 and evolve to become like the customers you serve, but as you talk to them you may change your mind about this goal.

Technical approach:
Shade: the most challenging part of this was to make a collision and movement system that worked with a moving and dynamically zooming camera, the final system I created is very robust, you can even drag around and resize the game while playing and on any screen and everything will dynamically fit the screen.

The collision function takes two coordinates, draws a line between them and scatters circles along the line to create a pill shape (a corridor), the game constantly keeps track of the last nearest circle centre point and if the player is within the radius of a circle, if the player is not within the radius of any circle (therefore outside a corridor) they are nudged back towards the last nearest circle centre point with a force that increases the further they are from the last nearest circle (this way walls feel a little squishy which makes colliding with them less jerky), the original map had much smaller corridors which were made much wider because this system is far more accurate and performant with wider corridors because fewer circles are needed for the same length of corridor.

Many versions of collision were attempted and abandoned before using this one, including Mario 64 style and a more modern vector math style both of which suffered from the potential to get out of bounds and being optimised for straight levels not rounded ones.

The originally I attempted to make all co-ordinates relative to the camera, the level would move opposite to the camera to imitate movement however this was a very hard confusing later in development so I started again with absolute co-ordinates, the camera instead acts after all collision and processes are complete, it draws a line between the two players to find the centre of the frame and it’s zoom is faked by scaling perceived coordinates and sprite sizes relative to the centre of the camera.

Inspiration:
The main source of inspiration is Pokémon, a series that bypasses the ethical concerns of forcing creatures to fight for sport by making them stupid. However in Eat Your Friends these creatures are more similar to babies who all have the capability to grow up and become intelligent. The visual style of the game however is meant to resemble a cooking game show or coliseum where violence is spectacle. Importantly the features of the modern world aren’t villainized, our goal isn’t to show people how much worse it could be but rather how bad it may already be.

Collaboration:
Shade: working on the code solo has been much less confusing than it would have been to share this responsibility, ideally I would have done only code and Mikaela and Morgan would have done only art however Morgan disappeared leaving Mikaela and I to do all his work for him (we did not give him credit for this work) and cut a few features such as upgrades in the form of fridge magnets to collect and a final ending screen once you attain all five stars. The original plan was that all the sound and animation would be done by Morgan, sprites by Mikaela and the map and code done by me however Morgan had not started sound when he disappeared.