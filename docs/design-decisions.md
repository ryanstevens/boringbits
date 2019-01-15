# Design Decisions

## Progressive Decomposition
Out of the box `boringbits` gives you a ton of magic where developers do not need to know or even understand how things are working under the hood.  This works for many people and many teams indefinitely so long the framework allows them to meet their goals.  Often though as a project matures the need to evolve outside of the framework becomes more and more apparent, so as a core design principle `boringbits` makes it a priority to ensure teams can "breakout" of the magic.  

Progressive decomposition as a design pattern refers to ones ability to replace `boringbits` design patterns over time with a teams own set of implementations and framework level decisions.  This is similar in concept to `CRA's` eject, but the key difference is instead of ejecting the entire application in one shot you swap out `boringbits` magic for your own bit by bit. 


## TODO - examples
