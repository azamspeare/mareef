<?php

declare(strict_types=1);

namespace App\Telegram\Commands;

use SergiX44\Nutgram\Handlers\Type\Command;
use SergiX44\Nutgram\Nutgram;

final class HelpCommand extends Command
{
    protected string $command = 'help';

    protected ?string $description = 'How to link your account';

    public function handle(Nutgram $bot): void
    {
        $bot->sendMessage(
            text: "ℹ️ Mareef Bot Help

Available commands:
/start — Start or restart setup
/code — Generate a new verification code

If you're stuck, return to the Mareef website
and follow the instructions shown there."
        );
    }
}
