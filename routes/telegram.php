<?php

/** @var SergiX44\Nutgram\Nutgram $bot */

use App\Telegram\Commands\CodeCommand;
use App\Telegram\Commands\HelpCommand;
use App\Telegram\Commands\StartCommand;
use App\Telegram\Handlers\ContactHandler;

/*
|--------------------------------------------------------------------------
| Nutgram Handlers
|--------------------------------------------------------------------------
|
| Here is where you can register telegram handlers for Nutgram. These
| handlers are loaded by the NutgramServiceProvider. Enjoy!
|
*/

$bot->registerCommand(StartCommand::class);
$bot->onContact(ContactHandler::class);

$bot->registerCommand(CodeCommand::class);
$bot->registerCommand(HelpCommand::class);
