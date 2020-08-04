import argparse


class TrainingConfig:
    def __init__(self, batch_size: int, num_classes: int, epochs: int,
                 data: str):
        self.batch_size = batch_size
        self.num_classes = num_classes
        self.epochs = epochs
        self.data = data


def parse_args() -> TrainingConfig:
    parser = argparse.ArgumentParser(description="Training script")
    parser.add_argument("--batch_size", default=128, type=int)
    parser.add_argument("--num_classes", default=10, type=int)
    parser.add_argument("--epochs", default=12, type=int)
    parser.add_argument("--data", type=str, required=True)

    args = parser.parse_args()

    return TrainingConfig(args.batch_size, args.num_classes, args.epochs,
                          args.data)
