![magikarp](https://github.com/jozanza/pokemonitor/blob/master/osx1.png?raw=true)

# PokéMonitor

Sends desktop and SMS notifications when Pokémon are near a geolocation. This command uses [Pokevision](https://pokevision.com)'s API.

## Installation

##### `npm i -g pokemonitor`

## Usage

At a minimum, you'll need to pass `pokemonitor` a latitude, a longitude, and a .csv file with the Pokémon you want to get notified about ([here's the list I use](https://gist.githubusercontent.com/jozanza/2ebea6e5bc1a7ac0bc36e1c0a3270de7/raw/431fdca06bb0d66e23804bfb2d91ddb970e30d7e/pokemon.csv)).

You can also pass additional flags to get SMS (via [Twilio](https://twilio.com)) and change the polling interval, etc.

```bash
 Usage: pokemonitor [options] <lat>,<lng>

  Get notified about Pokémon near a location

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -a, --alias <name>          Location alias for geo coordinates
    -s, --sms <to>,<from>       Phone numbers to send text message to and from
    -t, --twilio <SID>,<token>  Your Twilio Account SID and Twilio Auth Token (https://www.twilio.com/console)
    -p, --pokemon <file>        .csv file of Pokémon you want to get notified about
    -i, --interval <seconds>    How often to search (min 30)
```

## Examples

##### Basic Usage (Desktop Notifications)

```
pokemonitor --pokemon <file> <lat>,<lng>
```

##### Advanced Usage (Desktop Notifications and SMS)

```
pokemonitor --sms <to>,<from> --twilio <SID>,<token> --pokemon <file> <lat>,<lng>
```

