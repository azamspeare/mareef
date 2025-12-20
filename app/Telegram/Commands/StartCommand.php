<?php

declare(strict_types=1);

namespace App\Telegram\Commands;

use App\Actions\Telegram\CreateTelegramUserAction;
use App\DTOs\User\TelegramDTO;
use SergiX44\Nutgram\Handlers\Type\Command;
use SergiX44\Nutgram\Nutgram;
use SergiX44\Nutgram\Telegram\Types\Keyboard\KeyboardButton;
use SergiX44\Nutgram\Telegram\Types\Keyboard\ReplyKeyboardMarkup;

final class StartCommand extends Command
{
    protected string $command = 'start';

    protected ?string $description = 'Start the bot';

    public function handle(Nutgram $bot, CreateTelegramUserAction $action): void
    {
        $user = $bot->user();

        if (! $user) {
            return;
        }

        $dto = TelegramDTO::make([
            'chat_id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'username' => $user->username,
            'is_premium' => $user->is_premium ?? false
        ]);

        $action->run($dto);

        $bot->sendMessage(
            text: "👋 Welcome to Mareef Bot.

To connect your account:

1. Send your phone number
2. We'll reply with a 6-digit code
3. Enter that code on the Mareef website

Need help? Type /help.",
            reply_markup: ReplyKeyboardMarkup::make()
                ->addRow(KeyboardButton::make('Share Phone Number', request_contact: true))
        );
    }
}
