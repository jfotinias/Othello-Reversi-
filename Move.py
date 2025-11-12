class Move:
    def __init__(self, row=-1, col=-1, value=0):
        self._row = row
        self._col = col
        self._value = value

    # getters
    @property
    def row(self):
        return self._row
    
    @property
    def col(self):
        return self._col
    
    @property
    def value(self):
        return self._value
    
    # setters
    @property
    def set_row(self, row):
        self._row = row

    @property
    def set_col(self, col):
        self._col = col

    @property
    def set_value(self, value):
        self._value = value

    