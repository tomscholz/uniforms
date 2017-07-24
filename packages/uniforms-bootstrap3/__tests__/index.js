import * as bootstrap3 from 'uniforms-bootstrap3';

it('exports everything', () => {
    expect(bootstrap3).toEqual({
        AutoFields: expect.any(Function),
        AutoField: expect.any(Function),
        AutoForm: expect.any(Function),
        BaseForm: expect.any(Function),
        BoolField: expect.any(Function),
        DateField: expect.any(Function),
        ErrorField: expect.any(Function),
        ErrorsField: expect.any(Function),
        FormGroup: expect.any(Function),
        HiddenField: expect.any(Function),
        ListAddField: expect.any(Function),
        ListDelField: expect.any(Function),
        ListField: expect.any(Function),
        ListItemField: expect.any(Function),
        LongTextField: expect.any(Function),
        NestField: expect.any(Function),
        NumField: expect.any(Function),
        QuickForm: expect.any(Function),
        RadioField: expect.any(Function),
        SelectField: expect.any(Function),
        SubmitField: expect.any(Function),
        TextField: expect.any(Function),
        ValidatedForm: expect.any(Function),
        ValidatedQuickForm: expect.any(Function),
        gridClassName: expect.any(Function),
        wrapField: expect.any(Function)
    });
});
