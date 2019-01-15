# Yeoman generator for boringbits

This is a __built in__ yeoman generator to allow developers the ability to create entire boring applications, or add new components to their pre-existing boring code bases.

### Why not a stand alone `yeoman generator`

The short answer is generators are started, then typically fall out of sync with the frameworks they are generating over time simply because it's hard to maintain both a framework and it's generator.  By putting the generator inside of each boring release, we have better (easier) mechanisms to ensure generator <-> framework compatibility.  Another reason is so every boring based application that uses the framework also has the ability to instantly generate new / more components.  Lastly, the general practice of installing global modules as the `yeoman` ecosystem typically encourages seems like unnecessary friction, so boring maintainers preferred to abstract away that yeoman or a "generator" was even at play and simply provide the ability for boring can create scaffolding to users.

## Usage

### Option 1, install boringbits and use the built in generator
```bash
# make a new directory
mkdir my-boring-app
cd my-boring-app

# make a package.json and install boringbits
npm init -y && npm install boringbits@latest --save

npx boring generate
```

### OR Option 2, use the `create-boring-app` cli
```bash
# create-boring-app is NOT a yeoman generator itself
# but a tiny wrapper that simply installs boringbits@latest
# and automates the option 1
npx create-boring-app my-boring-app
```